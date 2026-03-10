'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface StepBarProps {
    steps: number;
    current: number;
    labels?: string[];
}

export default function StepBar({ steps, current, labels }: StepBarProps) {
    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-2">
                {Array.from({ length: steps }, (_, i) => {
                    const stepNum = i + 1;
                    const isCompleted = stepNum < current;
                    const isActive = stepNum === current;

                    return (
                        <React.Fragment key={i}>
                            <div className="flex flex-col items-center gap-1.5">
                                <motion.div
                                    initial={false}
                                    animate={{
                                        scale: isActive ? 1.1 : 1,
                                        backgroundColor: isCompleted || isActive ? '#3B82F6' : '#1F2937',
                                    }}
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors"
                                    style={{
                                        borderColor: isCompleted || isActive ? '#3B82F6' : '#374151',
                                    }}
                                >
                                    {isCompleted ? (
                                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <span className={isActive ? 'text-white' : 'text-gray-500'}>{stepNum}</span>
                                    )}
                                </motion.div>
                                {labels && labels[i] && (
                                    <span className={`text-[10px] font-medium hidden sm:block ${isActive ? 'text-blue-400' : isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {labels[i]}
                                    </span>
                                )}
                            </div>
                            {i < steps - 1 && (
                                <div className="flex-1 h-0.5 mx-2 relative">
                                    <div className="absolute inset-0 bg-gray-800 rounded-full" />
                                    <motion.div
                                        initial={false}
                                        animate={{ width: isCompleted ? '100%' : '0%' }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute inset-y-0 left-0 bg-blue-500 rounded-full"
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}
