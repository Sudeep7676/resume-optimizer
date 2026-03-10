'use client';

import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';

const features = [
    {
        icon: '🔬',
        title: 'Technical Depth',
        description: 'Master DSA, system design, and real-world engineering — beyond tutorials.',
    },
    {
        icon: '🤖',
        title: 'AI-Leveraged Engineering',
        description: 'Learn to build with AI tools, not just use them. Prompt engineering + code review.',
    },
    {
        icon: '🏗️',
        title: 'Production Exposure',
        description: 'Ship real projects. CI/CD, Docker, monitoring — the full production stack.',
    },
    {
        icon: '📣',
        title: 'Personal Brand Strategy',
        description: 'LinkedIn, GitHub, portfolio — we help you build authority in the tech space.',
    },
    {
        icon: '🚀',
        title: 'Career Readiness',
        description: 'Mock interviews, resume reviews, salary negotiation — complete career prep.',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function AboutSection() {
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
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 mb-6">
                        <span className="text-blue-400 text-sm font-medium">About NextGen Labs</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        We don&apos;t just teach coding.{' '}
                        <span className="gradient-text italic">We build careers.</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        NextGen Labs is a career acceleration platform that combines deep technical training
                        with real-world production experience and personal branding strategy.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
                >
                    {features.map((feature) => (
                        <motion.div key={feature.title} variants={itemVariants}>
                            <GlassCard className="h-full">
                                <div className="text-3xl mb-4">{feature.icon}</div>
                                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                            </GlassCard>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Footer Tagline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <p className="text-xl sm:text-2xl font-bold text-gray-300">
                        Build <span className="text-blue-400">Skills</span>. Build{' '}
                        <span className="text-blue-400">Authority</span>. Build{' '}
                        <span className="text-blue-400">Opportunities</span>.
                    </p>
                </motion.div>

                {/* Footer */}
                <div className="mt-16 pt-8 border-t border-white/5 text-center">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} NextGen Labs Pvt Ltd. All rights reserved.
                    </p>
                </div>
            </div>
        </section>
    );
}
