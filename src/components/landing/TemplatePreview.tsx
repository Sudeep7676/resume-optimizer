'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const features = [
    { label: 'ATS Optimized', icon: '✅' },
    { label: 'LaTeX Powered', icon: '📐' },
    { label: 'Fully Customizable', icon: '🎨' },
    { label: 'NextGen Labs Standard', icon: '🏆' },
];

export default function TemplatePreview() {
    return (
        <section id="templates" className="py-24 relative">
            <div className="max-w-6xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Resume <span className="gradient-text italic">Template</span> Preview
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Based on Jake&apos;s Resume — the gold standard for technical resumes.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Resume preview image */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="relative"
                    >
                        <div className="relative max-w-[420px] mx-auto rounded-xl overflow-hidden shadow-2xl shadow-blue-500/15 border border-white/10">
                            {/* Subtle glow overlay */}
                            <div className="absolute inset-0 ring-1 ring-blue-500/20 rounded-xl pointer-events-none z-10" />
                            <img
                                src="/resume-preview.png"
                                alt="ATS Resume Template Preview"
                                className="w-full h-auto block"
                            />
                        </div>
                        {/* Glow effect behind the image */}
                        <div className="absolute -inset-4 bg-blue-500/5 rounded-2xl blur-2xl -z-10" />
                    </motion.div>

                    {/* Features + CTA */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="space-y-8"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            {features.map((feature) => (
                                <div
                                    key={feature.label}
                                    className="flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.02]"
                                >
                                    <span className="text-xl">{feature.icon}</span>
                                    <span className="text-sm font-medium text-gray-300">{feature.label}</span>
                                </div>
                            ))}
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold mb-3">
                                Professional. <span className="text-blue-400 italic">Precise.</span> Perfect.
                            </h3>
                            <p className="text-gray-400 leading-relaxed mb-6">
                                Our LaTeX-based output ensures your resume renders flawlessly across all ATS systems.
                                No formatting issues. No broken layouts. Just clean, professional resumes that get you interviews.
                            </p>
                            <Link
                                href="/resume/enroll"
                                className="inline-flex px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl text-sm font-semibold hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg shadow-blue-500/25"
                            >
                                Start Building Your Resume →
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
