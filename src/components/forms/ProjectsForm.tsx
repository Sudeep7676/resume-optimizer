'use client';

import React from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import type { Project } from '@/types/resume';

interface Props {
    data: Project[];
    onChange: (data: Project[]) => void;
    errors: Record<string, string>;
}

export default function ProjectsForm({ data, onChange, errors }: Props) {
    const addProject = () => {
        onChange([
            ...data,
            {
                id: Date.now().toString(),
                name: '',
                techStack: '',
                liveUrl: '',
                githubUrl: '',
                description: ['', '', ''],
            },
        ]);
    };

    const removeProject = (index: number) => {
        onChange(data.filter((_, i) => i !== index));
    };

    const updateField = (index: number, field: keyof Project, value: string | string[]) => {
        const updated = [...data];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated);
    };

    const updateDescription = (projIndex: number, descIndex: number, value: string) => {
        const updated = [...data];
        const descs = [...updated[projIndex].description];
        descs[descIndex] = value;
        updated[projIndex] = { ...updated[projIndex], description: descs };
        onChange(updated);
    };

    const addDescription = (projIndex: number) => {
        const updated = [...data];
        updated[projIndex] = {
            ...updated[projIndex],
            description: [...updated[projIndex].description, ''],
        };
        onChange(updated);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white mb-1">Projects</h2>
                <p className="text-gray-400 text-sm">Showcase your best work — include at least one project.</p>
            </div>

            {errors.projects && (
                <p className="text-red-400 text-sm">{errors.projects}</p>
            )}

            {data.map((project, index) => (
                <div key={project.id} className="p-5 rounded-xl border border-white/5 bg-white/[0.01] space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-blue-400">Project #{index + 1}</h3>
                        <button
                            type="button"
                            onClick={() => removeProject(index)}
                            className="text-red-400 hover:text-red-300 text-xs cursor-pointer"
                        >
                            Remove
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="Project Name *"
                            placeholder="e.g. AI Resume Builder"
                            value={project.name}
                            onChange={(e) => updateField(index, 'name', e.target.value)}
                        />
                        <Input
                            label="Tech Stack Used *"
                            placeholder="e.g. Next.js, OpenAI, Tailwind"
                            value={project.techStack}
                            onChange={(e) => updateField(index, 'techStack', e.target.value)}
                        />
                        <Input
                            label="Live URL"
                            placeholder="e.g. https://myproject.vercel.app"
                            value={project.liveUrl}
                            onChange={(e) => updateField(index, 'liveUrl', e.target.value)}
                        />
                        <Input
                            label="GitHub URL"
                            placeholder="e.g. github.com/john/project"
                            value={project.githubUrl}
                            onChange={(e) => updateField(index, 'githubUrl', e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                            Description * (minimum 3 bullet points)
                        </label>
                        {project.description.map((desc, dIndex) => (
                            <div key={dIndex} className="flex items-center gap-2">
                                <span className="text-gray-500 text-xs w-4">•</span>
                                <input
                                    type="text"
                                    value={desc}
                                    onChange={(e) => updateDescription(index, dIndex, e.target.value)}
                                    placeholder={`Description point ${dIndex + 1}`}
                                    className="flex-1 px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                />
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addDescription(index)}
                            className="text-blue-400 hover:text-blue-300 text-xs font-medium mt-1 cursor-pointer"
                        >
                            + Add bullet point
                        </button>
                    </div>
                </div>
            ))}

            <Button variant="outline" size="md" onClick={addProject} type="button">
                + Add Project
            </Button>
        </div>
    );
}
