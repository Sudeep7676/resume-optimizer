'use client';

import React from 'react';
import type { Achievement } from '@/types/resume';

interface Props {
    data: Achievement[];
    onChange: (data: Achievement[]) => void;
}

export default function AchievementsForm({ data, onChange }: Props) {
    const addAchievement = () => {
        onChange([
            ...data,
            { id: Date.now().toString(), title: '', description: '' },
        ]);
    };

    const updateAchievement = (id: string, field: keyof Achievement, value: string) => {
        onChange(
            data.map((ach) =>
                ach.id === id ? { ...ach, [field]: value } : ach
            )
        );
    };

    const removeAchievement = (id: string) => {
        onChange(data.filter((ach) => ach.id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Achievements</h2>
                    <p className="text-gray-400 text-sm">Add your honors, awards, and significant accomplishments.</p>
                </div>
                <button
                    type="button"
                    onClick={addAchievement}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm font-medium border border-white/10"
                >
                    + Add Achievement
                </button>
            </div>

            {data.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-xl bg-white/5">
                    <p className="text-gray-400">No achievements added yet.</p>
                    <button
                        type="button"
                        onClick={addAchievement}
                        className="mt-4 px-4 py-2 bg-gradient-brand text-white rounded-lg hover:brightness-110 transition-all font-medium"
                    >
                        Add Your First Achievement
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {data.map((ach, index) => (
                        <div key={ach.id} className="p-6 bg-white/5 border border-white/10 rounded-xl relative group">
                            <button
                                type="button"
                                onClick={() => removeAchievement(ach.id)}
                                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                title="Remove achievement"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>

                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Achievement Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={ach.title}
                                        onChange={(e) => updateAchievement(ach.id, 'title', e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple"
                                        placeholder="e.g. Secured 2nd Place at HackFest 2024"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={ach.description}
                                        onChange={(e) => updateAchievement(ach.id, 'description', e.target.value)}
                                        rows={2}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple resize-none"
                                        placeholder="e.g. Built an end-to-end full stack solution within 24 hours, competing among 300+ participants"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
