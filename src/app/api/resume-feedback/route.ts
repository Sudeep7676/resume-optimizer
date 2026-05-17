import { NextResponse } from 'next/server';
import type { FormData } from '@/types/resume';

interface FI { category: string; icon: string; severity: 'critical'|'warning'|'suggestion'|'good'; title: string; description: string; fix?: string; }
interface Scores { overall: number; content: number; formatting: number; impact: number; ats: number; completeness: number; }

export async function POST(request: Request) {
    try {
        const formData: FormData = await request.json();
        const apiKey = process.env.OPENAI_API_KEY;
        const noKey = !apiKey || apiKey.trim() === '' || apiKey === 'none';

        if (noKey) {
            const result = analyze(formData);
            await new Promise(r => setTimeout(r, 1200));
            return NextResponse.json(result);
        }

        const OpenAI = (await import('openai')).default;
        const openai = new OpenAI({ apiKey });
        const prompt = buildPrompt(formData);
        const startTime = Date.now();

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: `You are a senior technical recruiter and resume expert. Analyze the resume data and provide brutally honest, specific, actionable feedback. Return ONLY valid JSON (no markdown fences):
{"scores":{"overall":0-100,"content":0-100,"formatting":0-100,"impact":0-100,"ats":0-100,"completeness":0-100},"feedback":[{"category":"string","icon":"emoji","severity":"critical|warning|suggestion|good","title":"string","description":"string","fix":"string"}],"summary":"2-3 sentences","strengths":["3-5 items"],"topPriority":"most important fix"}
Be very specific — mention actual content from the resume. Check: action verbs, quantified metrics, ATS keywords, section completeness, skill relevance, project depth, experience bullet quality.` },
                { role: 'user', content: prompt }
            ],
            temperature: 0.3, max_tokens: 2500,
        });

        const raw = completion.choices[0]?.message?.content || '';
        try {
            const parsed = JSON.parse(raw);
            return NextResponse.json({ ...parsed, generationTime: Date.now() - startTime, aiPowered: true });
        } catch {
            return NextResponse.json({ ...analyze(formData), generationTime: Date.now() - startTime });
        }
    } catch (error) {
        console.error('Resume feedback error:', error);
        return NextResponse.json({ error: 'Failed to analyze' }, { status: 500 });
    }
}

function buildPrompt(d: FormData): string {
    let p = `Analyze this resume:\n\nName: ${d.personal.fullName}\nEmail: ${d.personal.email}\nPhone: ${d.personal.phone}\nLinkedIn: ${d.personal.linkedin||'MISSING'}\nGitHub: ${d.personal.github||'MISSING'}\nPortfolio: ${d.personal.portfolio||'MISSING'}\n`;
    if (Object.values(d.skills).some(a=>a.length>0)) {
        p += `\nSkills:\n`;
        if (d.skills.languages.length) p += `Languages: ${d.skills.languages.join(', ')}\n`;
        if (d.skills.frontend.length) p += `Frontend: ${d.skills.frontend.join(', ')}\n`;
        if (d.skills.backend.length) p += `Backend: ${d.skills.backend.join(', ')}\n`;
        if (d.skills.databases.length) p += `Databases: ${d.skills.databases.join(', ')}\n`;
        if (d.skills.coreConcepts.length) p += `Core: ${d.skills.coreConcepts.join(', ')}\n`;
    }
    d.projects.forEach(pr => { p += `\nProject: ${pr.name} (${pr.techStack})\n${pr.description.filter(x=>x.trim()).map(x=>`  - ${x}`).join('\n')}\n`; });
    d.experience.forEach(e => { p += `\nExperience: ${e.jobTitle} at ${e.company} (${e.startDate}-${e.isCurrent?'Present':e.endDate})\n${e.responsibilities.filter(x=>x.trim()).map(x=>`  - ${x}`).join('\n')}\n`; });
    d.education.forEach(e => { p += `\nEducation: ${e.degree} from ${e.institution} (${e.graduationYear})${e.cgpa?` CGPA:${e.cgpa}`:''}\n`; });
    d.achievements?.forEach(a => { p += `\nAchievement: ${a.title} - ${a.description}\n`; });
    return p;
}

function analyze(d: FormData) {
    const fb: FI[] = [];
    const sc: Scores = { overall: 45, content: 45, formatting: 55, impact: 40, ats: 45, completeness: 40 };
    const str: string[] = [];

    // ═══ PERSONAL INFO ═══
    const hasLinkedin = !!d.personal.linkedin;
    const hasGithub = !!d.personal.github;
    const hasPortfolio = !!d.personal.portfolio;
    const profileLinks = [hasLinkedin, hasGithub, hasPortfolio].filter(Boolean).length;

    if (!hasLinkedin) {
        fb.push({ category: 'Contact', icon: '🔗', severity: 'warning', title: 'LinkedIn Profile Missing',
            description: '87% of recruiters check LinkedIn before scheduling interviews. Missing LinkedIn reduces your discoverability significantly.',
            fix: 'Add your LinkedIn URL. Ensure your LinkedIn headline matches your resume objective and has 500+ connections.' });
    } else { sc.completeness += 6; str.push('LinkedIn profile linked for recruiter discoverability'); }

    if (!hasGithub) {
        fb.push({ category: 'Contact', icon: '💻', severity: d.projects.length > 0 ? 'warning' : 'suggestion', title: 'GitHub Profile Not Linked',
            description: 'For software roles, GitHub proves you write code beyond coursework. Hiring managers check contribution graphs.',
            fix: 'Link your GitHub. Ensure repos are well-documented with README files and have recent activity.' });
    } else { sc.completeness += 5; sc.ats += 3; str.push('GitHub profile shows coding activity beyond coursework'); }

    if (!hasPortfolio) {
        fb.push({ category: 'Contact', icon: '🌐', severity: 'suggestion', title: 'No Portfolio Website',
            description: 'A portfolio site differentiates you from 92% of candidates. It\'s your personal brand.',
            fix: 'Build a simple portfolio using Next.js/React on Vercel. Showcase 3-4 best projects with screenshots and live demos.' });
    } else { sc.completeness += 5; str.push('Personal portfolio demonstrates initiative and personal branding'); }

    if (profileLinks === 3) {
        fb.push({ category: 'Contact', icon: '🏆', severity: 'good', title: 'Complete Professional Presence',
            description: 'Having LinkedIn, GitHub, and Portfolio gives recruiters a 360° view. Only 8% of applicants achieve this.' });
        sc.completeness += 5;
    }

    if (!d.personal.phone) {
        fb.push({ category: 'Contact', icon: '📱', severity: 'critical', title: 'Phone Number Missing',
            description: 'Recruiters need a phone number for screening calls. Resumes without phone numbers are often rejected immediately.',
            fix: 'Add your phone number with country code.' });
    }

    // ═══ SKILLS ═══
    const totalSkills = Object.values(d.skills).reduce((s, a) => s + a.length, 0);
    const skillCategories = Object.entries(d.skills).filter(([, v]) => v.length > 0).length;

    if (totalSkills === 0) {
        fb.push({ category: 'Skills', icon: '🚨', severity: 'critical', title: 'Skills Section is Empty',
            description: 'This is a dealbreaker. ATS systems match candidates by skills keywords. An empty skills section means 0% keyword match rate.',
            fix: 'Add 10-15 relevant skills across categories: Languages (Java, Python), Frontend (React, TypeScript), Backend (Node.js, Spring), Databases (PostgreSQL, MongoDB), Core (DSA, System Design)' });
    } else if (totalSkills < 6) {
        fb.push({ category: 'Skills', icon: '📊', severity: 'warning', title: `Only ${totalSkills} Skills — Below Competitive Threshold`,
            description: `Competitive resumes in tech list 12-18 skills. With ${totalSkills}, you\'re missing keyword matches for many job descriptions.`,
            fix: 'Target 12-18 skills. Include: programming languages, frameworks, tools (Git, Docker, AWS), methodologies (Agile, CI/CD), and testing frameworks.' });
        sc.content += 5;
    } else if (totalSkills >= 10) {
        sc.content += 12; sc.ats += 12;
        str.push(`Comprehensive skills section with ${totalSkills} technologies across ${skillCategories} categories`);
        fb.push({ category: 'Skills', icon: '✅', severity: 'good', title: `Strong Skill Coverage (${totalSkills} skills)`,
            description: `Your ${totalSkills} skills across ${skillCategories} categories provide excellent ATS keyword coverage.` });
    } else {
        sc.content += 8; sc.ats += 6;
    }

    if (d.skills.languages.length === 0 && totalSkills > 0) {
        fb.push({ category: 'Skills', icon: '⚠️', severity: 'warning', title: 'No Programming Languages Listed',
            description: 'Programming languages are the #1 ATS keyword for tech roles. JDs always list required languages.',
            fix: 'Add languages you\'re proficient in: Java, Python, JavaScript/TypeScript, C++, Go, Rust, etc.' });
    }

    if (d.skills.coreConcepts.length === 0 && totalSkills > 0) {
        fb.push({ category: 'Skills', icon: '🧠', severity: 'suggestion', title: 'Add Core CS Concepts',
            description: 'Listing fundamentals like DSA, OOP, System Design, DBMS signals strong foundations — critical for interview rounds.',
            fix: 'Add: Data Structures & Algorithms, OOP, System Design, Operating Systems, Computer Networks, DBMS' });
    }

    // Check for trending/in-demand skills
    const allSkills = Object.values(d.skills).flat().map(s => s.toLowerCase());
    const trendingPresent = ['typescript', 'react', 'next.js', 'nextjs', 'docker', 'kubernetes', 'aws', 'graphql', 'rust', 'go', 'tailwind'].filter(t => allSkills.some(s => s.includes(t)));
    if (trendingPresent.length >= 3) {
        str.push(`In-demand technologies: ${trendingPresent.join(', ')}`);
        sc.ats += 5;
    } else if (totalSkills > 5 && trendingPresent.length === 0) {
        fb.push({ category: 'Skills', icon: '📈', severity: 'suggestion', title: 'Consider Adding Trending Technologies',
            description: 'Modern job postings frequently require TypeScript, React/Next.js, Docker, AWS, or cloud technologies.',
            fix: 'If you know any: TypeScript, Docker, AWS/GCP, GraphQL, Kubernetes, CI/CD tools — add them to boost relevance.' });
    }

    // ═══ PROJECTS ═══
    if (d.projects.length === 0) {
        fb.push({ category: 'Projects', icon: '🚨', severity: 'critical', title: 'No Projects — Critical Gap',
            description: 'Projects are the #1 differentiator for students and early-career devs. Without them, your resume lacks proof of practical ability.',
            fix: 'Add 2-4 projects. Each should have: clear name, tech stack, 3-4 bullet points describing features built, problems solved, and technologies used.' });
    } else {
        if (d.projects.length >= 3) { sc.content += 10; str.push(`${d.projects.length} projects demonstrating hands-on building experience`); }
        else { sc.content += 5; }

        let projectsWithMetrics = 0;
        let projectsWithWeakDesc = 0;
        let projectsWithLinks = 0;

        d.projects.forEach(proj => {
            const bullets = proj.description.filter(x => x.trim());

            // Check bullet count
            if (bullets.length < 2) {
                projectsWithWeakDesc++;
                fb.push({ category: 'Projects', icon: '📝', severity: 'warning', title: `"${proj.name}" — Too Few Bullet Points`,
                    description: `Only ${bullets.length} bullet point(s). Each project needs 3-4 specific bullets describing what you built, why, and the outcome.`,
                    fix: `Add bullets answering: 1) What does it do? 2) What tech decisions did you make? 3) What was the impact/scale? 4) What challenges did you solve?` });
            }

            // Check for quantified metrics
            const hasMetrics = bullets.some(b => /\d+%|\d+x|\d+\s*(users|requests|ms|seconds|records|items|pages|endpoints|apis|features)/i.test(b));
            if (hasMetrics) { projectsWithMetrics++; sc.impact += 5; }
            else {
                fb.push({ category: 'Projects', icon: '📈', severity: 'suggestion', title: `Add Metrics to "${proj.name}"`,
                    description: 'Quantified results make 40% stronger impression. Numbers prove impact.',
                    fix: `Add measurable outcomes: "Reduced API response time by 60%", "Handles 10K+ concurrent users", "Processed 50K+ records", "Built 15+ REST endpoints"` });
            }

            // Check for action verbs
            const hasActionVerb = bullets.some(b => /^(built|developed|designed|implemented|created|engineered|architected|integrated|deployed|optimized|automated|configured|established|launched|scaled)/i.test(b.trim()));
            if (!hasActionVerb && bullets.length > 0) {
                fb.push({ category: 'Projects', icon: '✍️', severity: 'suggestion', title: `Strengthen "${proj.name}" Bullet Language`,
                    description: 'Starting with powerful action verbs signals ownership and technical leadership.',
                    fix: 'Rewrite bullets starting with: Built, Engineered, Implemented, Architected, Designed, Deployed, Optimized, Automated' });
            }

            // Check for links
            if (proj.liveUrl || proj.githubUrl) projectsWithLinks++;
        });

        if (projectsWithMetrics === d.projects.length && d.projects.length >= 2) {
            str.push('All projects include quantified metrics — demonstrates impact-driven thinking');
            sc.impact += 10;
        }

        if (projectsWithLinks === 0 && d.projects.length > 0) {
            fb.push({ category: 'Projects', icon: '🔗', severity: 'warning', title: 'No Project Links Provided',
                description: 'Live demos and GitHub links let recruiters instantly verify your work. Projects without links feel unverifiable.',
                fix: 'Deploy projects on Vercel/Netlify and push code to GitHub. Add both URLs to each project.' });
        } else if (projectsWithLinks === d.projects.length) {
            str.push('All projects have verifiable links — strong credibility signal');
            sc.completeness += 5;
        }

        if (projectsWithWeakDesc === 0 && d.projects.length >= 2) {
            fb.push({ category: 'Projects', icon: '✅', severity: 'good', title: 'Well-Documented Projects',
                description: 'Your projects have detailed descriptions that clearly communicate what you built and the technology used.' });
        }
    }

    // ═══ EXPERIENCE ═══
    if (d.experience.length === 0) {
        fb.push({ category: 'Experience', icon: '💼', severity: 'suggestion', title: 'No Work Experience Listed',
            description: 'If you\'re a student, this is okay — but even internships, freelance work, or open-source contributions count.',
            fix: 'Add any: internships, part-time dev work, freelance projects, open-source contributions, teaching/mentoring roles' });
    } else {
        sc.content += 12;
        str.push(`${d.experience.length} professional experience${d.experience.length > 1 ? 's' : ''} listed`);

        d.experience.forEach(exp => {
            const resps = exp.responsibilities.filter(r => r.trim());

            if (resps.length < 3) {
                fb.push({ category: 'Experience', icon: '📋', severity: 'warning', title: `"${exp.jobTitle}" Needs More Detail`,
                    description: `Only ${resps.length} bullet(s). Hiring managers expect 3-5 impact-driven bullets per role.`,
                    fix: 'Use the XYZ formula: "Accomplished [X] as measured by [Y] by doing [Z]". Example: "Reduced page load time by 45% by implementing lazy loading and CDN caching"' });
            } else {
                sc.content += 3;
            }

            // Action verb check
            const startsWithAction = resps.filter(r => /^(developed|built|led|managed|created|designed|implemented|optimized|improved|deployed|architected|integrated|automated|reduced|increased|delivered|launched|mentored|collaborated|established|engineered|spearheaded|orchestrated)/i.test(r.trim()));
            if (startsWithAction.length < resps.length * 0.5 && resps.length > 0) {
                fb.push({ category: 'Experience', icon: '✍️', severity: 'warning', title: 'Weak Action Verbs in Experience',
                    description: `Only ${startsWithAction.length}/${resps.length} bullets start with action verbs. This weakens perceived ownership.`,
                    fix: 'Every bullet should start with a power verb: Engineered, Spearheaded, Architected, Delivered, Optimized, Orchestrated, Automated' });
            } else if (startsWithAction.length >= resps.length * 0.7) {
                sc.impact += 8;
            }

            // Metrics check
            const hasNumbers = resps.some(r => /\d+%|\d+x|\$\d|\d+\s*(users|clients|features|endpoints|microservices)/i.test(r));
            if (!hasNumbers && resps.length > 0) {
                fb.push({ category: 'Experience', icon: '📊', severity: 'warning', title: `Quantify Impact at "${exp.company}"`,
                    description: 'Bullets without numbers feel generic. Recruiters scan for measurable achievements.',
                    fix: 'Add metrics: "Improved API throughput by 200%", "Served 50K+ daily users", "Reduced deployment time from 2hrs to 15min"' });
            } else if (hasNumbers) {
                sc.impact += 10;
                str.push(`Quantified achievements at ${exp.company}`);
            }
        });
    }

    // ═══ EDUCATION ═══
    if (d.education.length === 0) {
        fb.push({ category: 'Education', icon: '🎓', severity: 'critical', title: 'Education Section Missing',
            description: 'Education is mandatory for entry-level to mid-level positions. ATS systems flag resumes without education.',
            fix: 'Add your degree, institution, graduation year. Include CGPA if above average and relevant coursework.' });
    } else {
        sc.completeness += 8;
        d.education.forEach(edu => {
            if (!edu.cgpa) {
                fb.push({ category: 'Education', icon: '📊', severity: 'suggestion', title: 'Consider Adding CGPA/GPA',
                    description: 'If your GPA is 3.0+/7.0+, include it. For fresh graduates, GPA is a key screening criterion.',
                    fix: 'Add your CGPA/GPA if it\'s competitive. Format: "CGPA: 8.5/10" or "GPA: 3.7/4.0"' });
            } else {
                sc.completeness += 4;
                const gpa = parseFloat(edu.cgpa);
                if (gpa >= 8.5 || gpa >= 3.5) str.push(`Strong academic record (${edu.cgpa})`);
            }
            if (edu.coursework.length === 0) {
                fb.push({ category: 'Education', icon: '📚', severity: 'suggestion', title: 'Add Relevant Coursework',
                    description: 'Coursework helps ATS match you for specialized roles and shows domain knowledge depth.',
                    fix: 'Add 5-8 courses: Data Structures, Algorithms, DBMS, Operating Systems, Computer Networks, Machine Learning, Software Engineering' });
            } else if (edu.coursework.length >= 4) {
                sc.completeness += 3;
            }
        });
    }

    // ═══ ACHIEVEMENTS ═══
    if (!d.achievements || d.achievements.length === 0) {
        fb.push({ category: 'Achievements', icon: '🏆', severity: 'suggestion', title: 'No Achievements Listed',
            description: 'Achievements separate top 10% candidates from the rest. They prove excellence beyond regular work.',
            fix: 'Add: hackathon wins/participation, coding contest ranks (LeetCode, CodeForces), certifications (AWS, Google), academic awards, publications' });
    } else {
        sc.content += 8; sc.impact += 5;
        if (d.achievements.length >= 3) str.push(`${d.achievements.length} achievements showcasing competitive excellence`);

        d.achievements.forEach(ach => {
            const hasSpecifics = /\d|first|won|rank|top|medal|certified|selected|national|international|gold|silver|finalist/i.test(ach.title + ' ' + ach.description);
            if (!hasSpecifics) {
                fb.push({ category: 'Achievements', icon: '🎯', severity: 'suggestion', title: `Make "${ach.title}" More Specific`,
                    description: 'Vague achievements don\'t impress. Add rank, competition name, year, or specific outcome.',
                    fix: 'Be specific: "1st Place at XYZ Hackathon 2024 (500+ participants)" instead of "Won a hackathon"' });
            }
        });
    }

    // ═══ ATS OPTIMIZATION ═══
    fb.push({ category: 'ATS', icon: '🤖', severity: 'good', title: 'ATS-Optimized LaTeX Template',
        description: 'Jake\'s Resume template is one of the most ATS-compatible formats. Clean single-column layout passes 95%+ of ATS parsers.' });
    sc.ats += 12;

    if (d.sectionOrder?.[0] === 'skills') {
        str.push('Skills section positioned first — maximizes ATS keyword scanning');
        sc.ats += 5;
    } else {
        fb.push({ category: 'ATS', icon: '📐', severity: 'suggestion', title: 'Consider Skills-First Section Order',
            description: 'Placing Skills first ensures ATS captures your keywords immediately. Current order may bury important keywords.',
            fix: 'Recommended order: Skills → Projects → Experience → Achievements → Education' });
    }

    // ═══ FINAL SCORING ═══
    const critical = fb.filter(f => f.severity === 'critical').length;
    const warnings = fb.filter(f => f.severity === 'warning').length;
    const goods = fb.filter(f => f.severity === 'good').length;

    sc.overall = Math.min(100, Math.max(5, Math.round(
        (sc.content + sc.formatting + sc.impact + sc.ats + sc.completeness) / 5 - (critical * 12) - (warnings * 4) + (goods * 4)
    )));
    sc.content = Math.min(100, Math.max(5, sc.content));
    sc.impact = Math.min(100, Math.max(5, sc.impact));
    sc.ats = Math.min(100, Math.max(5, sc.ats));
    sc.completeness = Math.min(100, Math.max(5, sc.completeness));
    sc.formatting = Math.min(100, Math.max(40, sc.formatting));

    let summary: string;
    if (sc.overall >= 80) summary = `Excellent resume! Your profile is strong with ${str.length} key strengths. The suggestions below are polish items — you're already ahead of 85% of applicants.`;
    else if (sc.overall >= 60) summary = `Solid foundation with clear areas for improvement. Addressing the ${warnings} warnings below could boost your callback rate by 40-60%.`;
    else if (sc.overall >= 40) summary = `Your resume needs significant work. ${critical} critical issues and ${warnings} warnings are hurting your chances. Focus on the critical items first.`;
    else summary = `Your resume has major gaps that will get it filtered out by ATS systems. ${critical} critical issues must be addressed immediately. Start with the top priority below.`;

    const topPriority = fb.find(f => f.severity === 'critical')?.title
        || fb.find(f => f.severity === 'warning')?.title
        || 'Continue refining bullet points with metrics and action verbs';

    if (str.length === 0) str.push('Using a professional, ATS-compatible LaTeX template');

    return { scores: sc, feedback: fb, summary, strengths: str, topPriority, aiPowered: false };
}
