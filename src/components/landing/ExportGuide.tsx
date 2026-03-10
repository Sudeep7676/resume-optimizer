'use client';

import React from 'react';
import { motion } from 'framer-motion';

const steps = [
    {
        number: 1,
        title: 'Open Overleaf',
        description: 'Visit overleaf.com and sign in or create a free account.',
        icon: '🌐',
    },
    {
        number: 2,
        title: 'New Blank Project',
        description: 'Click "New Project" → "Blank Project" to start fresh.',
        icon: '📁',
    },
    {
        number: 3,
        title: 'Paste LaTeX Code',
        description: 'Copy your generated LaTeX and paste it into the editor.',
        icon: '📋',
    },
    {
        number: 4,
        title: 'Recompile',
        description: 'Click the green "Recompile" button to render your resume.',
        icon: '🔄',
    },
    {
        number: 5,
        title: 'Download PDF',
        description: 'Download your beautifully formatted PDF resume.',
        icon: '📥',
    },
];

export default function ExportGuide() {
    return (
        <section className="py-24 relative bg-gradient-to-b from-transparent via-blue-500/[0.02] to-transparent">
            <div className="max-w-4xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        LaTeX → <span className="gradient-text italic">PDF</span> Export Guide
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Five simple steps to your perfect PDF resume.
                    </p>
                </motion.div>

                <div className="space-y-6">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.number}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex items-start gap-4 p-5 rounded-xl border border-white/5 bg-white/[0.02] hover:border-blue-500/20 transition-all"
                        >
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-lg">
                                {step.icon}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-blue-400 font-mono text-xs">Step {step.number}</span>
                                    <h3 className="text-white font-semibold">{step.title}</h3>
                                </div>
                                <p className="text-gray-400 text-sm">{step.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
