export interface PersonalDetails {
  fullName: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  responsibilities: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  graduationYear: string;
  cgpa: string;
  coursework: string[];
}

export interface Skills {
  languages: string[];
  frontend: string[];
  backend: string[];
  databases: string[];
  coreConcepts: string[];
}

export interface Project {
  id: string;
  name: string;
  techStack: string;
  liveUrl: string;
  githubUrl: string;
  description: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
}

export interface FormData {
  personal: PersonalDetails;
  experience: Experience[];
  education: Education[];
  skills: Skills;
  projects: Project[];
  achievements: Achievement[];
  sectionOrder: string[];
}

export interface ResumeStore {
  step: number;
  formData: FormData;
  generatedLatex: string;
  tokensUsed: number;
  generationTime: number;
  setStep: (step: number) => void;
  updatePersonal: (data: PersonalDetails) => void;
  updateExperience: (data: Experience[]) => void;
  updateEducation: (data: Education[]) => void;
  updateSkills: (data: Skills) => void;
  updateProjects: (data: Project[]) => void;
  updateAchievements: (data: Achievement[]) => void;
  updateSectionOrder: (order: string[]) => void;
  setGeneratedLatex: (latex: string) => void;
  setTokensUsed: (tokens: number) => void;
  setGenerationTime: (time: number) => void;
  resetForm: () => void;
}

export interface Submission {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
  experience: Experience[];
  education: Education[];
  skills: Skills;
  projects: Project[];
  achievements: Achievement[];
  sectionOrder: string[];
  generated_latex: string;
  tokens_used: number;
  created_at: string;
}
