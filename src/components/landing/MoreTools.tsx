'use client';

import React from 'react';
import { motion } from 'framer-motion';

const tools = [
    { name: 'Canva', tag: 'Free', color: 'bg-purple-500/20 text-purple-400', url: 'https://www.canva.com/resumes/' },
    { name: 'Resume Genius', tag: 'Paid', color: 'bg-amber-500/20 text-amber-400', url: 'https://resumegenius.com/' },
    { name: 'Zety', tag: 'Paid', color: 'bg-amber-500/20 text-amber-400', url: 'https://zety.com/' },
    { name: 'Novoresume', tag: 'Free', color: 'bg-purple-500/20 text-purple-400', url: 'https://novoresume.com/' },
    { name: 'Resume.com', tag: 'Free', color: 'bg-purple-500/20 text-purple-400', url: 'https://www.resume.com/' },
    { name: 'VisualCV', tag: 'Paid', color: 'bg-amber-500/20 text-amber-400', url: 'https://www.visualcv.com/' },
    { name: 'Enhancv', tag: 'Paid', color: 'bg-amber-500/20 text-amber-400', url: 'https://enhancv.com/' },
    { name: 'Resume.io', tag: 'Paid', color: 'bg-amber-500/20 text-amber-400', url: 'https://resume.io/' },
    { name: 'My Perfect Resume', tag: 'Paid', color: 'bg-amber-500/20 text-amber-400', url: 'https://www.myperfectresume.com/' },
    { name: 'SlashCV', tag: 'Free', color: 'bg-purple-500/20 text-purple-400', url: 'https://slashcv.com/' },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

export default function MoreTools() {
    return (
        <section className="py-24 relative">
            <div className="max-w-6xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        More <span className="gradient-text italic">Tools</span> Comparison
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Beyond Resume Builder — more than 30 curated builders to explore. Click any to visit.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4"
                >
                    {tools.map((tool) => (
                        <motion.a
                            key={tool.name}
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            variants={itemVariants}
                            whileHover={{ scale: 1.04, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            className="relative p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:border-blue-500/20 hover:bg-white/[0.04] transition-all text-center group cursor-pointer"
                        >
                            <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-500/20 transition-colors">
                                <span className="text-lg font-bold text-gray-400 group-hover:text-blue-300 transition-colors">{tool.name[0]}</span>
                            </div>
                            <h3 className="text-sm font-medium text-white mb-2 group-hover:text-blue-200 transition-colors">{tool.name}</h3>
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${tool.color}`}>
                                {tool.tag}
                            </span>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </div>
                        </motion.a>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
