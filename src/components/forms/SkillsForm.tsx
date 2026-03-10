'use client';

import React from 'react';
import TagInput from '@/components/ui/TagInput';
import type { Skills } from '@/types/resume';

interface Props {
    data: Skills;
    onChange: (data: Skills) => void;
    errors: Record<string, string>;
}

export default function SkillsForm({ data, onChange, errors }: Props) {
    const update = (field: keyof Skills, value: string[]) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white mb-1">Technical Skills</h2>
                <p className="text-gray-400 text-sm">Type a skill and press Enter or use commas to add multiple tags.</p>
            </div>

            <div className="space-y-4">
                <TagInput
                    label="Programming Languages *"
                    tags={data.languages}
                    onChange={(tags) => update('languages', tags)}
                    placeholder="e.g. Java, JavaScript, Python"
                    error={errors.languages}
                />
                <TagInput
                    label="Frontend Technologies *"
                    tags={data.frontend}
                    onChange={(tags) => update('frontend', tags)}
                    placeholder="e.g. HTML5, CSS3, React, Tailwind CSS"
                    error={errors.frontend}
                />
                <TagInput
                    label="Backend Technologies *"
                    tags={data.backend}
                    onChange={(tags) => update('backend', tags)}
                    placeholder="e.g. Spring Boot, Node.js, REST API"
                    error={errors.backend}
                />
                <TagInput
                    label="Database Technologies *"
                    tags={data.databases}
                    onChange={(tags) => update('databases', tags)}
                    placeholder="e.g. MySQL, PostgreSQL, MongoDB"
                    error={errors.databases}
                />
                <TagInput
                    label="Core subjects *"
                    tags={data.coreConcepts}
                    onChange={(tags) => update('coreConcepts', tags)}
                    placeholder="e.g. OOPS, Computer Networks, DBMS"
                    error={errors.coreConcepts}
                />
            </div>
        </div>
    );
}
