'use client';

import React from 'react';
import Input from '@/components/ui/Input';
import type { PersonalDetails } from '@/types/resume';

interface Props {
    data: PersonalDetails;
    onChange: (data: PersonalDetails) => void;
    errors: Record<string, string>;
}

export default function PersonalDetailsForm({ data, onChange, errors }: Props) {
    const update = (field: keyof PersonalDetails, value: string) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white mb-1">Personal Details</h2>
                <p className="text-gray-400 text-sm">Tell us about yourself — this goes at the top of your resume.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                    label="Full Name *"
                    placeholder="e.g. John Developer"
                    value={data.fullName}
                    onChange={(e) => update('fullName', e.target.value)}
                    error={errors.fullName}
                />
                <Input
                    label="Phone Number *"
                    placeholder="e.g. +91 98765 43210"
                    value={data.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    error={errors.phone}
                />
                <Input
                    label="Email Address *"
                    type="email"
                    placeholder="e.g. john@email.com"
                    value={data.email}
                    onChange={(e) => update('email', e.target.value)}
                    error={errors.email}
                />
                <Input
                    label="LinkedIn URL"
                    placeholder="e.g. linkedin.com/in/john"
                    value={data.linkedin}
                    onChange={(e) => update('linkedin', e.target.value)}
                />
                <Input
                    label="GitHub URL"
                    placeholder="e.g. github.com/john"
                    value={data.github}
                    onChange={(e) => update('github', e.target.value)}
                />
                <Input
                    label="Portfolio URL"
                    placeholder="e.g. johndoe.dev"
                    value={data.portfolio}
                    onChange={(e) => update('portfolio', e.target.value)}
                />
            </div>
        </div>
    );
}
