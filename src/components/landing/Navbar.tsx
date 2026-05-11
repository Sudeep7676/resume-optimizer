'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();
    const navBg = useTransform(scrollY, [0, 50], ['rgba(10, 15, 30, 0)', 'rgba(10, 15, 30, 0.85)']);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ backgroundColor: navBg }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                ? 'backdrop-blur-2xl border-b border-white/[0.05] shadow-2xl shadow-black/30'
                : ''
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <motion.div
                            whileHover={{ rotate: [0, -5, 5, 0] }}
                            transition={{ duration: 0.5 }}
                            className="relative"
                        >
                            <div className="absolute -inset-1 bg-blue-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                            <img 
                                src="/logo.png" 
                                alt="NextGen Labs" 
                                className="relative w-9 h-9 rounded-xl object-contain"
                            />
                        </motion.div>
                        <div className="hidden sm:block">
                            <span className="text-white font-bold text-lg tracking-tight">
                                <span className="gradient-text-premium font-black">NextGen Labs</span>
                            </span>
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-6">
                        <a 
                            href="#contact" 
                            className="text-sm font-medium text-gray-300 hover:text-white transition-colors cursor-pointer"
                        >
                            Contact Us
                        </a>
                        <Link
                            href="/feedback"
                            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                        >
                            Feedback
                        </Link>
                        <Link
                            href="/resume/enroll"
                            className="hidden sm:inline-flex items-center justify-center px-5 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/25"
                        >
                            Build Resume
                        </Link>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
