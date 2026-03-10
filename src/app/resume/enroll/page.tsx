'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useResumeStore } from '@/store/useResumeStore';
import StepBar from '@/components/ui/StepBar';
import Button from '@/components/ui/Button';
import PersonalDetailsForm from '@/components/forms/PersonalDetailsForm';
import ExperienceForm from '@/components/forms/ExperienceForm';
import EducationForm from '@/components/forms/EducationForm';
import SkillsForm from '@/components/forms/SkillsForm';
import ProjectsForm from '@/components/forms/ProjectsForm';
import AchievementsForm from '@/components/forms/AchievementsForm';
import SectionOrderForm from '@/components/forms/SectionOrderForm';
import Link from 'next/link';

const stepLabels = ['Personal', 'Experience', 'Education', 'Skills', 'Projects', 'Achievements', 'Layout'];

export default function EnrollPage() {
    const router = useRouter();
    const store = useResumeStore();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const validateStep = useCallback((): boolean => {
        const newErrors: Record<string, string> = {};

        switch (store.step) {
            case 1:
                if (!store.formData.personal.fullName.trim()) newErrors.fullName = 'Name is required';
                if (!store.formData.personal.email.trim()) newErrors.email = 'Email is required';
                if (!store.formData.personal.phone.trim()) newErrors.phone = 'Phone is required';
                break;
            case 2:
                // Experience is optional
                break;
            case 3:
                if (store.formData.education.length === 0) newErrors.education = 'Add at least one education entry';
                break;
            case 4:
                // Skills
                if (store.formData.skills.languages.length === 0) newErrors.languages = 'Add at least one programming language';
                break;
            case 5:
                // Projects optional
                break;
            case 6:
                // Achievements optional
                break;
            case 7:
                // Layout optional
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [store.step, store.formData]);

    const handleNext = () => {
        if (validateStep()) {
            store.setStep(store.step + 1);
            setErrors({});
        }
    };

    const handleBack = () => {
        store.setStep(store.step - 1);
        setErrors({});
    };

    const handleGenerate = async () => {
        if (!validateStep()) return;

        setLoading(true);
        try {
            const res = await fetch('/api/generate-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(store.formData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to generate resume');
            }

            const data = await res.json();
            store.setGeneratedLatex(data.latex);
            store.setTokensUsed(data.tokensUsed);
            store.setGenerationTime(data.generationTime);
            router.push('/resume/preview');
        } catch (error) {
            setErrors({ submit: error instanceof Error ? error.message : 'Something went wrong' });
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (store.step) {
            case 1:
                return (
                    <PersonalDetailsForm
                        data={store.formData.personal}
                        onChange={store.updatePersonal}
                        errors={errors}
                    />
                );
            case 2:
                return (
                    <ExperienceForm
                        data={store.formData.experience}
                        onChange={store.updateExperience}
                        errors={errors}
                    />
                );
            case 3:
                return (
                    <EducationForm
                        data={store.formData.education}
                        onChange={store.updateEducation}
                        errors={errors}
                    />
                );
            case 4:
                return (
                    <SkillsForm
                        data={store.formData.skills}
                        onChange={store.updateSkills}
                        errors={errors}
                    />
                );
            case 5:
                return (
                    <ProjectsForm
                        data={store.formData.projects}
                        onChange={store.updateProjects}
                        errors={errors}
                    />
                );
            case 6:
                return (
                    <AchievementsForm
                        data={store.formData.achievements}
                        onChange={store.updateAchievements}
                    />
                );
            case 7:
                return (
                    <SectionOrderForm
                        data={store.formData.sectionOrder}
                        onChange={store.updateSectionOrder}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <main className="min-h-screen bg-[#0a0f1e]">
            {/* Header */}
            <div className="border-b border-white/5 bg-[#0a0f1e]/80 backdrop-blur-xl sticky top-0 z-40">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <span className="text-white font-bold text-xs">NL</span>
                        </div>
                        <span className="text-white font-semibold hidden sm:block">NextGen Labs</span>
                    </Link>
                    <span className="text-gray-500 text-sm">
                        Step {store.step} of 7
                    </span>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Step Bar */}
                <div className="mb-8">
                    <StepBar steps={7} current={store.step} labels={stepLabels} />
                </div>

                {/* Form Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={store.step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 sm:p-8"
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>

                {/* Error message */}
                {errors.submit && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                    >
                        {errors.submit}
                    </motion.div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between mt-6">
                    <div>
                        {store.step > 1 && (
                            <Button variant="ghost" onClick={handleBack} type="button">
                                ← Back
                            </Button>
                        )}
                    </div>
                    <div>
                        {store.step < 7 ? (
                            <Button variant="primary" onClick={handleNext} type="button">
                                Next →
                            </Button>
                        ) : (
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={handleGenerate}
                                isLoading={loading}
                                type="button"
                            >
                                {loading ? 'Generating...' : '✨ Generate Resume'}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
