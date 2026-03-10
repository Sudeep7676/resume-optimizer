'use client';

import React from 'react';
import Input from '@/components/ui/Input';
import TagInput from '@/components/ui/TagInput';
import Button from '@/components/ui/Button';
import type { Education } from '@/types/resume';

interface Props {
    data: Education[];
    onChange: (data: Education[]) => void;
    errors: Record<string, string>;
}

export default function EducationForm({ data, onChange, errors }: Props) {
    const addEducation = () => {
        onChange([
            ...data,
            {
                id: Date.now().toString(),
                degree: '',
                institution: '',
                location: '',
                graduationYear: '',
                cgpa: '',
                coursework: [],
            },
        ]);
    };

    const removeEducation = (index: number) => {
        onChange(data.filter((_, i) => i !== index));
    };

    const updateField = (index: number, field: keyof Education, value: string | string[]) => {
        const updated = [...data];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white mb-1">Education</h2>
                <p className="text-gray-400 text-sm">Add your educational background.</p>
            </div>

            {errors.education && (
                <p className="text-red-400 text-sm">{errors.education}</p>
            )}

            {data.map((edu, index) => (
                <div key={edu.id} className="p-5 rounded-xl border border-white/5 bg-white/[0.01] space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-blue-400">Education #{index + 1}</h3>
                        <button
                            type="button"
                            onClick={() => removeEducation(index)}
                            className="text-red-400 hover:text-red-300 text-xs cursor-pointer"
                        >
                            Remove
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="Degree *"
                            placeholder="e.g. B.Tech Computer Science"
                            value={edu.degree}
                            onChange={(e) => updateField(index, 'degree', e.target.value)}
                        />
                        <Input
                            label="Institution Name *"
                            placeholder="e.g. IIT Delhi"
                            value={edu.institution}
                            onChange={(e) => updateField(index, 'institution', e.target.value)}
                        />
                        <Input
                            label="Location"
                            placeholder="e.g. New Delhi, India"
                            value={edu.location}
                            onChange={(e) => updateField(index, 'location', e.target.value)}
                        />
                        <Input
                            label="Year of Graduation *"
                            placeholder="e.g. 2024"
                            value={edu.graduationYear}
                            onChange={(e) => updateField(index, 'graduationYear', e.target.value)}
                        />
                        <Input
                            label="CGPA / Percentage"
                            placeholder="e.g. 8.5 / 10"
                            value={edu.cgpa}
                            onChange={(e) => updateField(index, 'cgpa', e.target.value)}
                        />
                    </div>

                    <TagInput
                        label="Relevant Coursework"
                        tags={edu.coursework}
                        onChange={(tags) => updateField(index, 'coursework', tags)}
                        placeholder="Type a course and press Enter"
                    />
                </div>
            ))}

            <Button variant="outline" size="md" onClick={addEducation} type="button">
                + Add Education
            </Button>
        </div>
    );
}
