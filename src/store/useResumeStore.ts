'use client';

import { create } from 'zustand';
import type { ResumeStore, PersonalDetails, Experience, Education, Skills, Project, Achievement } from '@/types/resume';

const initialPersonal: PersonalDetails = {
    fullName: '',
    phone: '',
    email: '',
    linkedin: '',
    github: '',
    portfolio: '',
};

const initialSkills: Skills = {
    languages: [],
    frontend: [],
    backend: [],
    databases: [],
    coreConcepts: [],
};

const initialSectionOrder = ['skills', 'projects', 'experience', 'achievements', 'education'];

export const useResumeStore = create<ResumeStore>((set) => ({
    step: 1,
    formData: {
        personal: initialPersonal,
        experience: [],
        education: [],
        skills: initialSkills,
        projects: [],
        achievements: [],
        sectionOrder: initialSectionOrder,
    },
    generatedLatex: '',
    tokensUsed: 0,
    generationTime: 0,

    setStep: (step: number) => set({ step }),

    updatePersonal: (data: PersonalDetails) =>
        set((state) => ({
            formData: { ...state.formData, personal: data },
        })),

    updateExperience: (data: Experience[]) =>
        set((state) => ({
            formData: { ...state.formData, experience: data },
        })),

    updateEducation: (data: Education[]) =>
        set((state) => ({
            formData: { ...state.formData, education: data },
        })),

    updateSkills: (data: Skills) =>
        set((state) => ({
            formData: { ...state.formData, skills: data },
        })),

    updateProjects: (data: Project[]) =>
        set((state) => ({
            formData: { ...state.formData, projects: data },
        })),

    updateAchievements: (data: Achievement[]) =>
        set((state) => ({
            formData: { ...state.formData, achievements: data },
        })),

    updateSectionOrder: (order: string[]) =>
        set((state) => ({
            formData: { ...state.formData, sectionOrder: order },
        })),

    setGeneratedLatex: (latex: string) => set({ generatedLatex: latex }),
    setTokensUsed: (tokens: number) => set({ tokensUsed: tokens }),
    setGenerationTime: (time: number) => set({ generationTime: time }),

    resetForm: () =>
        set({
            step: 1,
            formData: {
                personal: initialPersonal,
                experience: [],
                education: [],
                skills: initialSkills,
                projects: [],
                achievements: [],
                sectionOrder: initialSectionOrder,
            },
            generatedLatex: '',
            tokensUsed: 0,
            generationTime: 0,
        }),
}));
