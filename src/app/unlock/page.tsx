'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function UnlockPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleUnlock = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/unlock', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    window.location.href = '/';
                }, 1200);
            } else {
                setError('Incorrect password. Try again.');
            }
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <main className="min-h-screen bg-[#040812] flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/30">
                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <p className="text-xl font-bold text-white">Access Granted</p>
                    <p className="text-gray-400 text-sm mt-2">Redirecting to platform...</p>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#040812] flex items-center justify-center p-4 relative overflow-hidden">
            <style>{`
                @keyframes gradient-shift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .nextgen-gradient {
                    background: linear-gradient(135deg, #60A5FA, #a78bfa, #f472b6, #60A5FA);
                    background-size: 200% 200%;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: gradient-shift 4s ease infinite;
                }
            `}</style>

            {/* Animated background orbs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Grid lines */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />

                {/* Central mega glow */}
                <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.65, 0.4] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-blue-600/10 blur-[140px]"
                />
                {/* Top-right purple */}
                <motion.div
                    animate={{ y: [0, -40, 0], x: [0, 25, 0], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-purple-500/10 blur-[100px]"
                />
                {/* Bottom-left cyan */}
                <motion.div
                    animate={{ y: [0, 50, 0], scale: [1, 1.25, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                    className="absolute bottom-1/4 left-1/4 w-[250px] h-[250px] rounded-full bg-cyan-500/8 blur-[80px]"
                />
                {/* Top-left accent */}
                <motion.div
                    animate={{ x: [0, -30, 0], opacity: [0.1, 0.25, 0.1] }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
                    className="absolute top-1/3 left-1/5 w-[200px] h-[200px] rounded-full bg-indigo-500/10 blur-[60px]"
                />
            </div>

            {/* Card */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Animated glow ring behind card */}
                <motion.div
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/15 to-blue-600/20 rounded-3xl blur-xl"
                />

                <div className="relative rounded-2xl border border-white/[0.08] bg-[#0a0f1e]/90 backdrop-blur-xl p-8 shadow-2xl">
                    {/* Logo & branding */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0.4, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="inline-block mb-5"
                        >
                            <img 
                                src="/logo.png" 
                                alt="NextGen Labs" 
                                className="w-16 h-16 rounded-2xl object-contain mx-auto"
                            />
                        </motion.div>

                        {/* Animated "NextGen Labs" letter-by-letter unveil */}
                        <motion.h1
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.45 }}
                            className="text-2xl font-black tracking-tight"
                        >
                            <span className="nextgen-gradient">NextGen Labs</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.65 }}
                            className="text-gray-500 text-[10px] tracking-[0.4em] uppercase mt-1.5 font-medium"
                        >
                            Private Limited
                        </motion.p>
                    </div>

                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.75 }}
                        className="flex justify-center mb-6"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            <span className="text-amber-400/90 text-[11px] font-semibold tracking-wider uppercase">
                                Private Access
                            </span>
                        </span>
                    </motion.div>

                    {/* Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.85 }}
                        className="text-center mb-8"
                    >
                        <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
                            Resume{' '}
                            <span
                                style={{
                                    background: 'linear-gradient(135deg, #3B82F6, #60A5FA, #93C5FD)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                                className="italic"
                            >
                                Optimizer
                            </span>
                        </h2>
                        <div className="flex items-center justify-center gap-3 text-gray-500 text-xs">
                            <span>For Students</span>
                            <span className="w-1 h-1 rounded-full bg-blue-500" />
                            <span>Powered by <span className="text-blue-400 font-semibold">NextGen Labs</span></span>
                        </div>
                    </motion.div>

                    {/* Form */}
                    <motion.form
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1 }}
                        onSubmit={handleUnlock}
                        className="space-y-5"
                    >
                        <div>
                            <label className="block text-[11px] font-semibold text-gray-400 mb-2 tracking-wider uppercase">
                                Access Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your access password"
                                className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                                required
                            />
                            {error && (
                                <p className="text-red-400 text-xs mt-2.5 flex items-center gap-1.5">
                                    ✕ {error}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !password}
                            className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            ) : '🔓'}
                            {loading ? 'Verifying...' : 'Unlock Access'}
                        </button>
                    </motion.form>

                    <p className="text-center text-gray-600 text-[10px] mt-6 tracking-wide">
                        Contact your instructor for access credentials
                    </p>
                </div>
            </motion.div>

            {/* Corner decorations */}
            <div className="absolute top-6 left-6 flex items-center gap-1.5 text-gray-700 text-[10px] font-mono tracking-wider">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 animate-pulse" />
                SYSTEM.ONLINE
            </div>
            <div className="absolute bottom-6 right-6 text-gray-700 text-[10px] font-mono tracking-wider">
                v2.0.4 · ENCRYPTED
            </div>
        </main>
    );
}
