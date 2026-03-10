'use client';

import React from 'react';

interface Props {
    data: string[];
    onChange: (data: string[]) => void;
}

const sectionDisplayNames: Record<string, string> = {
    skills: 'Technical Skills',
    projects: 'Projects',
    experience: 'Work Experience / Internship',
    achievements: 'Achievements',
    education: 'Education',
};

export default function SectionOrderForm({ data, onChange }: Props) {
    const moveItem = (index: number, direction: 'up' | 'down') => {
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === data.length - 1)
        ) {
            return;
        }

        const newOrder = [...data];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;

        // Swap elements
        [newOrder[index], newOrder[swapIndex]] = [newOrder[swapIndex], newOrder[index]];

        onChange(newOrder);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white mb-1">Customize Layout</h2>
                <p className="text-gray-400 text-sm">Arrange Resume Sections. The Personal Details header is fixed at the top and cannot be moved.</p>
            </div>

            <div className="space-y-3">
                {data.map((sectionId, index) => (
                    <div
                        key={sectionId}
                        className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-lg bg-brand-purple/20 flex items-center justify-center text-brand-purple font-bold">
                                {index + 1}
                            </div>
                            <span className="text-white font-medium">
                                {sectionDisplayNames[sectionId] || sectionId}
                            </span>
                        </div>

                        <div className="flex flex-col gap-1">
                            <button
                                type="button"
                                onClick={() => moveItem(index, 'up')}
                                disabled={index === 0}
                                className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                            </button>
                            <button
                                type="button"
                                onClick={() => moveItem(index, 'down')}
                                disabled={index === data.length - 1}
                                className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm flex gap-3 items-start">
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>The ATS format strictly relies on logical flow. Most technical resumes put Education at the bottom and Skills at the top.</p>
            </div>
        </div>
    );
}
