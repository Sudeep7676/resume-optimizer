'use client';

import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';

const steps = [
    {
        number: '01',
        title: 'Fill Your Details',
        description: 'Enter your personal info, experience, education, skills, and projects through our guided multi-step form.',
        icon: '📝',
    },
    {
        number: '02',
        title: 'Generate LaTeX',
        description: 'Our AI engine transforms your data into a professionally formatted LaTeX resume using Jake\'s Resume template.',
        icon: '⚡',
    },
    {
        number: '03',
        title: 'Export via Overleaf',
        description: 'Copy your generated LaTeX code, paste it into Overleaf, compile, and download a pixel-perfect PDF resume.',
        icon: '📄',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function ThreeSteps() {
    return (
        <section className="py-24 relative">
            <div className="max-w-6xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Three steps to a{' '}
                        <span className="gradient-text italic">recruiter-ready</span> resume.
                    </h2>
                    <p className="text-gray-400 text-lg max-w-xl mx-auto">
                        From raw data to polished PDF in minutes, not hours.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {steps.map((step) => (
                        <motion.div key={step.number} variants={itemVariants}>
                            <GlassCard className="h-full text-center">
                                <div className="text-4xl mb-4">{step.icon}</div>
                                <div className="text-blue-400 font-mono text-sm mb-2">
                                    Step {step.number}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {step.description}
                                </p>
                            </GlassCard>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
