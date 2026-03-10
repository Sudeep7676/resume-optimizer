'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const letterVariants = {
    hidden: { opacity: 0, y: 40, rotateX: -90 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        rotateX: 0,
        transition: {
            delay: 0.5 + i * 0.05,
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        },
    }),
};

const headlineWords = ['Build', 'a'];
const accentWord = 'Recruiter-Ready';
const endWord = 'Resume.';

function AnimatedLetter({ char, index }: { char: string; index: number }) {
    return (
        <motion.span
            custom={index}
            variants={letterVariants}
            initial="hidden"
            animate="visible"
            className="inline-block"
        >
            {char === ' ' ? '\u00A0' : char}
        </motion.span>
    );
}

function FloatingShape({ className, delay }: { className: string; delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 1, ease: 'easeOut' }}
            className={className}
        >
            <div className="w-full h-full" />
        </motion.div>
    );
}

export default function Hero() {
    let globalIndex = 0;

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-x-hidden pt-16 noise-overlay">
            {/* Layered background effects */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-grid animate-grid-fade" />

                {/* Primary glow orb */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-blue-600/15 rounded-full blur-[120px]" />

                {/* Secondary glow orbs */}
                <div className="absolute top-1/3 right-1/6 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[80px]" />
                <div className="absolute bottom-1/3 left-1/6 w-[250px] h-[250px] bg-cyan-500/8 rounded-full blur-[60px]" />
            </div>

            {/* Floating geometric shapes */}
            <FloatingShape
                delay={1}
                className="absolute top-[15%] left-[10%] w-16 h-16 border border-blue-500/10 rounded-2xl rotate-45 opacity-30"
            />
            <FloatingShape
                delay={1.5}
                className="absolute top-[25%] right-[15%] w-10 h-10 border border-purple-500/10 rounded-full opacity-20"
            />
            <FloatingShape
                delay={2}
                className="absolute bottom-[30%] left-[20%] w-8 h-8 bg-blue-500/5 rounded-lg rotate-12 opacity-40"
            />
            <FloatingShape
                delay={2.5}
                className="absolute bottom-[20%] right-[10%] w-14 h-14 border border-cyan-500/10 rounded-xl -rotate-12 opacity-25"
            />

            {/* Scan line */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/5 to-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0a0f1e] to-transparent z-10" />

            <div className="relative z-20 max-w-5xl mx-auto px-4 text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 mb-10 backdrop-blur-sm">
                        <motion.div
                            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-2 h-2 rounded-full bg-blue-400"
                        />
                        <span className="text-blue-400 text-xs font-semibold tracking-wider uppercase">
                            AI-Powered Resume Engine
                        </span>
                    </div>
                </motion.div>

                {/* Animated headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.2] mb-8 tracking-tight overflow-visible">
                    {headlineWords.map((word) => (
                        <React.Fragment key={word}>
                            {word.split('').map((char) => {
                                const i = globalIndex++;
                                return <AnimatedLetter key={`${word}-${i}`} char={char} index={i} />;
                            })}
                            <AnimatedLetter char=" " index={globalIndex++} />
                        </React.Fragment>
                    ))}
                    <br />
                    <span className="gradient-text-premium italic font-black whitespace-nowrap inline-block pb-2 overflow-visible">
                        {accentWord.split('').map((char) => {
                            const i = globalIndex++;
                            return <AnimatedLetter key={`accent-${i}`} char={char} index={i} />;
                        })}
                    </span>
                    <br />
                    {endWord.split('').map((char) => {
                        const i = globalIndex++;
                        return <AnimatedLetter key={`end-${i}`} char={char} index={i} />;
                    })}
                </h1>

                {/* Subtext */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.6, ease: 'easeOut' }}
                    className="text-base sm:text-lg text-gray-400 max-w-xl mx-auto mb-12 leading-relaxed font-light"
                >
                    Structured AI prompts ·{' '}
                    <span className="text-gray-300">Professional LaTeX workflow</span> ·{' '}
                    ATS-optimized output
                </motion.p>

                {/* CTA buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.8, ease: 'easeOut' }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                        <Link
                            href="/resume/enroll"
                            className="relative inline-flex px-10 py-4 rounded-2xl text-base font-bold text-white overflow-hidden group shadow-2xl shadow-blue-500/20"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 group-hover:from-blue-500 group-hover:to-indigo-500 transition-all" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            <span className="relative flex items-center gap-2">
                                Generate Resume Portal
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                        </Link>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                        <a
                            href="#templates"
                            className="inline-flex px-10 py-4 border border-white/[0.08] text-gray-300 rounded-2xl text-base font-medium hover:border-blue-500/30 hover:text-white transition-all backdrop-blur-sm bg-white/[0.02] hover:bg-white/[0.04]"
                        >
                            View Resume Templates
                        </a>
                    </motion.div>
                </motion.div>

                {/* Stats row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 2.2, ease: 'easeOut' }}
                    className="flex items-center justify-center gap-8 sm:gap-12 mt-16"
                >
                    {[
                        { value: '10K+', label: 'Resumes Built' },
                        { value: '95%', label: 'ATS Pass Rate' },
                        { value: '4.9★', label: 'User Rating' },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">{stat.value}</p>
                            <p className="text-[11px] text-gray-500 mt-1 tracking-wide uppercase font-medium">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Animated watermark */}
            <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none z-0">
                <motion.p
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 0.03, y: 0 }}
                    transition={{ duration: 2, delay: 2 }}
                    className="text-[10rem] sm:text-[16rem] lg:text-[20rem] font-black text-white text-center leading-none select-none tracking-tighter"
                >
                    RESUME
                </motion.p>
            </div>

            {/* Corner tech decorations */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
                className="absolute top-24 left-6 hidden lg:flex flex-col gap-1 text-[9px] font-mono text-gray-700 tracking-widest"
            >
                <span>SYS.ONLINE</span>
                <span>BUILD.2024</span>
                <div className="w-8 h-px bg-blue-500/20 mt-1" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
                className="absolute top-24 right-6 hidden lg:flex flex-col items-end gap-1 text-[9px] font-mono text-gray-700 tracking-widest"
            >
                <span>NEXT.GEN</span>
                <span>AI.ENGINE</span>
                <div className="w-8 h-px bg-blue-500/20 mt-1" />
            </motion.div>
        </section>
    );
}
