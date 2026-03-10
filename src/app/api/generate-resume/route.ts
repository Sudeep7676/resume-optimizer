import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import OpenAI from 'openai';
import type { FormData } from '@/types/resume';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        // Check access cookie
        const cookieStore = await cookies();
        const accessCookie = cookieStore.get('itech_access');
        if (!accessCookie || accessCookie.value !== 'true') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData: FormData = await request.json();
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            // FALLBACK MODE: Return a basic LaTeX template populated with the form data
            // This allows the app to function for testing without requiring an OpenAI API key
            const fallbackLatex = generateFallbackLatex(formData);

            // Artificial delay to simulate generation time
            await new Promise(resolve => setTimeout(resolve, 1500));

            return NextResponse.json({
                latex: fallbackLatex,
                tokensUsed: 0,
                generationTime: 1500,
                isMock: true
            });
        }

        const openai = new OpenAI({ apiKey });

        const prompt = buildPrompt(formData);
        const startTime = Date.now();

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content:
                        "You are an elite technical resume writer. Generate a complete, ATS-optimized LaTeX resume using the popular single-column ATS format (often called Jake's Resume). MUST rigidly follow this section order: Heading -> Skills -> Projects -> Internship/Experience -> Achievements -> Education. Use \\resumeItemListStart and \\resumeItem for bullet points. Return ONLY valid LaTeX code. No markdown code fences. Example structure:\n\\section{Skills}\n \\begin{itemize}[leftmargin=0.15in, label={}]\n    \\small{\\item{\n     \\textbf{Languages}{: Java, Python} \\\\\n     \\textbf{Frontend}{: React, HTML5}\n    }}\n \\end{itemize}\n\\section{Projects}\n  \\resumeSubHeadingListStart\n    \\resumeProjectHeading\n      {\\textbf{Project Name} $|$ \\emph{Tech Stack}}{Date -- Date}\n      \\resumeItemListStart\n        \\resumeItem{Description point}\n      \\resumeItemListEnd\n  \\resumeSubHeadingListEnd",
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.2, // Lower temperature to strictly enforce formatting
            max_tokens: 4000,
        });

        const generationTime = Date.now() - startTime;
        const latex = completion.choices[0]?.message?.content || '';
        const tokensUsed = completion.usage?.total_tokens || 0;

        // Save to Supabase if configured
        if (supabase) {
            try {
                await supabase.from('submissions').insert({
                    full_name: formData.personal.fullName,
                    email: formData.personal.email,
                    phone: formData.personal.phone,
                    linkedin: formData.personal.linkedin,
                    github: formData.personal.github,
                    portfolio: formData.personal.portfolio,
                    experience: formData.experience,
                    education: formData.education,
                    skills: formData.skills,
                    projects: formData.projects,
                    achievements: formData.achievements,
                    section_order: formData.sectionOrder,
                    generated_latex: latex,
                    tokens_used: tokensUsed,
                });
            } catch (dbError) {
                console.error('Supabase save error:', dbError);
            }
        }

        return NextResponse.json({
            latex,
            tokensUsed,
            generationTime,
        });
    } catch (error) {
        console.error('Generate resume error:', error);
        return NextResponse.json(
            { error: 'Failed to generate resume' },
            { status: 500 }
        );
    }
}

function buildPrompt(data: FormData): string {
    let prompt = `Generate a professional LaTeX resume for the following person:\n\n`;

    // Personal Header is always first
    prompt += `## Personal Information\n`;
    prompt += `Name: ${data.personal.fullName}\n`;
    prompt += `Email: ${data.personal.email}\n`;
    prompt += `Phone: ${data.personal.phone}\n`;
    if (data.personal.linkedin) prompt += `LinkedIn: ${data.personal.linkedin}\n`;
    if (data.personal.github) prompt += `GitHub: ${data.personal.github}\n`;
    if (data.personal.portfolio) prompt += `Portfolio: ${data.personal.portfolio}\n`;

    const renderSection = (section: string) => {
        switch (section) {
            case 'skills':
                if (Object.values(data.skills).some(arr => arr.length > 0)) {
                    prompt += `\n## Technical Skills\n`;
                    if (data.skills.languages.length > 0) prompt += `Programming Languages: ${data.skills.languages.join(', ')}\n`;
                    if (data.skills.frontend.length > 0) prompt += `Frontend Technologies: ${data.skills.frontend.join(', ')}\n`;
                    if (data.skills.backend.length > 0) prompt += `Backend Technologies: ${data.skills.backend.join(', ')}\n`;
                    if (data.skills.databases.length > 0) prompt += `Database Technologies: ${data.skills.databases.join(', ')}\n`;
                    if (data.skills.coreConcepts.length > 0) prompt += `Core Concepts: ${data.skills.coreConcepts.join(', ')}\n`;
                }
                break;
            case 'projects':
                if (data.projects.length > 0) {
                    prompt += `\n## Projects\n`;
                    data.projects.forEach((proj) => {
                        prompt += `- ${proj.name} (${proj.techStack})`;
                        if (proj.liveUrl) prompt += ` | Live: ${proj.liveUrl}`;
                        if (proj.githubUrl) prompt += ` | GitHub: ${proj.githubUrl}`;
                        prompt += `\n`;
                        proj.description.forEach((d) => {
                            if (d.trim()) prompt += `  • ${d}\n`;
                        });
                    });
                }
                break;
            case 'experience':
                if (data.experience.length > 0) {
                    prompt += `\n## Work Experience / Internship\n`;
                    data.experience.forEach((exp) => {
                        prompt += `- ${exp.jobTitle} at ${exp.company}, ${exp.location} (${exp.startDate} - ${exp.isCurrent ? 'Present' : exp.endDate})\n`;
                        exp.responsibilities.forEach((r) => {
                            if (r.trim()) prompt += `  • ${r}\n`;
                        });
                    });
                }
                break;
            case 'achievements':
                if (data.achievements?.length > 0) {
                    prompt += `\n## Achievements\n`;
                    data.achievements.forEach((ach) => {
                        prompt += `- **${ach.title}** — ${ach.description}\n`;
                    });
                }
                break;
            case 'education':
                if (data.education.length > 0) {
                    prompt += `\n## Education\n`;
                    data.education.forEach((edu) => {
                        prompt += `- ${edu.degree} from ${edu.institution}, ${edu.location} (${edu.graduationYear})`;
                        if (edu.cgpa) prompt += ` — CGPA/Percentage: ${edu.cgpa}`;
                        prompt += `\n`;
                        if (edu.coursework.length > 0) {
                            prompt += `  Relevant Coursework: ${edu.coursework.join(', ')}\n`;
                        }
                    });
                }
                break;
        }
    };

    // Render dynamically based on user's array order
    if (data.sectionOrder && data.sectionOrder.length > 0) {
        data.sectionOrder.forEach(section => renderSection(section));
    } else {
        // Fallback default order
        ['skills', 'projects', 'experience', 'achievements', 'education'].forEach(section => renderSection(section));
    }

    return prompt;
}

// Fallback LaTeX generator when OpenAI API key is missing
function generateFallbackLatex(data: FormData): string {
    let latex = `\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}

%----------FONT OPTIONS----------
% sans-serif
% \\usepackage[sfdefault]{FiraSans}
% \\usepackage[sfdefault]{roboto}
% \\usepackage[sfdefault]{noto-sans}
% \\usepackage[default]{sourcesanspro}

% serif
% \\usepackage{CormorantGaramond}
% \\usepackage{charter}

\\pagestyle{fancy}
\\fancyhf{} % clear all header and footer fields
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-0.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Ensure that generate pdf is machine readable/ATS parsable
\\pdfgentounicode=1

%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubSubheading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textit{\\small#1} & \\textit{\\small #2} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}
\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}
\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape ${data.personal.fullName}} \\\\ \\vspace{1pt}
    \\small ${data.personal.phone} $|$ \\href{mailto:${data.personal.email}}{\\underline{${data.personal.email}}} 
    ${data.personal.linkedin ? `$|$ \\href{${data.personal.linkedin}}{\\underline{LinkedIn}}` : ''}
    ${data.personal.github ? `$|$ \\href{${data.personal.github}}{\\underline{GitHub}}` : ''}
    ${data.personal.portfolio ? `$|$ \\href{${data.personal.portfolio}}{\\underline{Portfolio}}` : ''}
\\end{center}
`;

    // Render chunks based on section order
    const renderChunk = (section: string) => {
        switch (section) {
            case 'skills':
                if (Object.values(data.skills).some(arr => arr.length > 0)) {
                    latex += `\n%-----------PROGRAMMING SKILLS-----------\n\\section{Skills}\n \\begin{itemize}[leftmargin=0.15in, label={}]\n    \\small{\\item{\n`;
                    if (data.skills.languages.length > 0) latex += `     \\textbf{Programming Languages}{: ${data.skills.languages.join(', ')}} \\\\\n`;
                    if (data.skills.frontend.length > 0) latex += `     \\textbf{Frontend}{: ${data.skills.frontend.join(', ')}} \\\\\n`;
                    if (data.skills.backend.length > 0) latex += `     \\textbf{Backend}{: ${data.skills.backend.join(', ')}} \\\\\n`;
                    if (data.skills.databases.length > 0) latex += `     \\textbf{Databases}{: ${data.skills.databases.join(', ')}} \\\\\n`;
                    if (data.skills.coreConcepts.length > 0) latex += `     \\textbf{Core subjects}{: ${data.skills.coreConcepts.join(', ')}} \\\\\n`;
                    // remove last newline & backslash
                    latex = latex.replace(/ \\\\\n$/, '\n');
                    latex += `    }}\n \\end{itemize}\n`;
                }
                break;
            case 'projects':
                if (data.projects.length > 0) {
                    latex += `\n%-----------PROJECTS-----------\n\\section{Projects}\n    \\resumeSubHeadingListStart\n`;
                    data.projects.forEach(proj => {
                        const rightSide = proj.liveUrl ? `Live: \\href{${proj.liveUrl}}{\\underline{${proj.liveUrl.replace('https://', '').replace('http://', '')}}}` : '';
                        latex += `      \\resumeProjectHeading\n          {\\textbf{${proj.name}} $|$ \\emph{${proj.techStack}}}{${rightSide}}\n          \\resumeItemListStart\n`;
                        proj.description.forEach(d => {
                            if (d.trim()) latex += `            \\resumeItem{${d}}\n`;
                        });
                        latex += `          \\resumeItemListEnd\n`;
                    });
                    latex += `    \\resumeSubHeadingListEnd\n`;
                }
                break;
            case 'experience':
                if (data.experience.length > 0) {
                    latex += `\n%-----------EXPERIENCE-----------\n\\section{Internship / Experience}\n  \\resumeSubHeadingListStart\n`;
                    data.experience.forEach(exp => {
                        latex += `    \\resumeSubheading\n      {${exp.jobTitle}}{${exp.startDate} -- ${exp.isCurrent ? 'Present' : exp.endDate}}\n      {${exp.company}}{${exp.location}}\n      \\resumeItemListStart\n`;
                        exp.responsibilities.forEach(r => {
                            if (r.trim()) latex += `        \\resumeItem{${r}}\n`;
                        });
                        latex += `      \\resumeItemListEnd\n`;
                    });
                    latex += `  \\resumeSubHeadingListEnd\n`;
                }
                break;
            case 'achievements':
                if (data.achievements?.length > 0) {
                    latex += `\n%-----------ACHIEVEMENTS-----------\n\\section{Achievements}\n \\begin{itemize}[leftmargin=0.15in, label={}]\n`;
                    data.achievements.forEach(ach => {
                        latex += `    \\small{\\item{ \\textbf{${ach.title}} — ${ach.description} }}\n`;
                    });
                    latex += ` \\end{itemize}\n`;
                }
                break;
            case 'education':
                if (data.education.length > 0) {
                    latex += `\n%-----------EDUCATION-----------\n\\section{Education}\n  \\resumeSubHeadingListStart\n`;
                    data.education.forEach(edu => {
                        const rightsideline2 = edu.location ? edu.location : '';
                        latex += `    \\resumeSubheading\n      {${edu.institution}}{${edu.graduationYear}}\n      {${edu.degree}${edu.cgpa ? `, CGPA: ${edu.cgpa}` : ''}}{${rightsideline2}}\n`;
                    });
                    latex += `  \\resumeSubHeadingListEnd\n`;
                }
                break;
        }
    };

    const order = (data.sectionOrder && data.sectionOrder.length > 0) ? data.sectionOrder : ['skills', 'projects', 'experience', 'achievements', 'education'];
    order.forEach(section => renderChunk(section));

    latex += `\n\\end{document}\n`;
    return latex;
}

