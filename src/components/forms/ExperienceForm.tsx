'use client';

import React from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import type { Experience } from '@/types/resume';

interface Props {
    data: Experience[];
    onChange: (data: Experience[]) => void;
    errors: Record<string, string>;
}

export default function ExperienceForm({ data, onChange, errors }: Props) {
    const addExperience = () => {
        onChange([
            ...data,
            {
                id: Date.now().toString(),
                jobTitle: '',
                company: '',
                location: '',
                startDate: '',
                endDate: '',
                isCurrent: false,
                responsibilities: ['', '', ''],
            },
        ]);
    };

    const removeExperience = (index: number) => {
        onChange(data.filter((_, i) => i !== index));
    };

    const updateField = (index: number, field: keyof Experience, value: string | boolean | string[]) => {
        const updated = [...data];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated);
    };

    const updateResponsibility = (expIndex: number, respIndex: number, value: string) => {
        const updated = [...data];
        const resps = [...updated[expIndex].responsibilities];
        resps[respIndex] = value;
        updated[expIndex] = { ...updated[expIndex], responsibilities: resps };
        onChange(updated);
    };

    const addResponsibility = (expIndex: number) => {
        const updated = [...data];
        updated[expIndex] = {
            ...updated[expIndex],
            responsibilities: [...updated[expIndex].responsibilities, ''],
        };
        onChange(updated);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white mb-1">Work Experience</h2>
                <p className="text-gray-400 text-sm">Add your work experience — most recent first.</p>
            </div>

            {errors.experience && (
                <p className="text-red-400 text-sm">{errors.experience}</p>
            )}

            {data.map((exp, index) => (
                <div key={exp.id} className="p-5 rounded-xl border border-white/5 bg-white/[0.01] space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-blue-400">Experience #{index + 1}</h3>
                        <button
                            type="button"
                            onClick={() => removeExperience(index)}
                            className="text-red-400 hover:text-red-300 text-xs cursor-pointer"
                        >
                            Remove
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="Job Title *"
                            placeholder="e.g. Software Engineer"
                            value={exp.jobTitle}
                            onChange={(e) => updateField(index, 'jobTitle', e.target.value)}
                        />
                        <Input
                            label="Company Name *"
                            placeholder="e.g. Google"
                            value={exp.company}
                            onChange={(e) => updateField(index, 'company', e.target.value)}
                        />
                        <Input
                            label="Location"
                            placeholder="e.g. Bangalore, India"
                            value={exp.location}
                            onChange={(e) => updateField(index, 'location', e.target.value)}
                        />
                        <Input
                            label="Start Date *"
                            placeholder="e.g. Jan 2023"
                            value={exp.startDate}
                            onChange={(e) => updateField(index, 'startDate', e.target.value)}
                        />
                        {!exp.isCurrent && (
                            <Input
                                label="End Date"
                                placeholder="e.g. Dec 2024"
                                value={exp.endDate}
                                onChange={(e) => updateField(index, 'endDate', e.target.value)}
                            />
                        )}
                        <div className="flex items-end">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={exp.isCurrent}
                                    onChange={(e) => updateField(index, 'isCurrent', e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500/50"
                                />
                                <span className="text-sm text-gray-300">Currently working here</span>
                            </label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                            Responsibilities * (minimum 3 bullet points)
                        </label>
                        {exp.responsibilities.map((resp, rIndex) => (
                            <div key={rIndex} className="flex items-center gap-2">
                                <span className="text-gray-500 text-xs w-4">•</span>
                                <input
                                    type="text"
                                    value={resp}
                                    onChange={(e) => updateResponsibility(index, rIndex, e.target.value)}
                                    placeholder={`Responsibility ${rIndex + 1}`}
                                    className="flex-1 px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                />
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addResponsibility(index)}
                            className="text-blue-400 hover:text-blue-300 text-xs font-medium mt-1 cursor-pointer"
                        >
                            + Add bullet point
                        </button>
                    </div>
                </div>
            ))}

            <Button variant="outline" size="md" onClick={addExperience} type="button">
                + Add Experience
            </Button>
        </div>
    );
}
