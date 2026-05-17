'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { analyzeSentiment, getSentimentEmoji } from '@/lib/sentiment';

const EMOJIS = [
    { emoji: '😍', label: 'Love it' },
    { emoji: '🔥', label: 'Fire' },
    { emoji: '👍', label: 'Great' },
    { emoji: '💼', label: 'Professional' },
    { emoji: '✨', label: 'Amazing' },
    { emoji: '🚀', label: 'Fast' },
    { emoji: '🎯', label: 'Accurate' },
    { emoji: '💡', label: 'Smart' },
];

const CATEGORIES = [
    { value: 'general', label: 'General', icon: '💬' },
    { value: 'ui_design', label: 'UI/Design', icon: '🎨' },
    { value: 'resume_quality', label: 'Resume Quality', icon: '📄' },
    { value: 'feature_request', label: 'Feature Request', icon: '💡' },
    { value: 'bug_report', label: 'Bug Report', icon: '🐛' },
];

const RATING_LABELS = ['', 'Needs Work', 'Okay', 'Good', 'Great', 'Outstanding!'];

function StarRating({ rating, setRating, hovered, setHovered }: {
    rating: number; setRating: (r: number) => void;
    hovered: number; setHovered: (r: number) => void;
}) {
    return (
        <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => {
                const filled = star <= (hovered || rating);
                return (
                    <motion.button
                        key={star} type="button"
                        whileHover={{ scale: 1.25, rotate: [0, -8, 8, 0] }}
                        whileTap={{ scale: 0.9 }}
                        onMouseEnter={() => setHovered(star)}
                        onMouseLeave={() => setHovered(0)}
                        onClick={() => setRating(star)}
                        className="cursor-pointer focus:outline-none"
                    >
                        <svg
                            className={`w-10 h-10 sm:w-12 sm:h-12 transition-all duration-200 ${filled ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' : 'text-gray-600 hover:text-gray-500'}`}
                            fill={filled ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={filled ? 0 : 1.5}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>
                    </motion.button>
                );
            })}
        </div>
    );
}

function ConfettiEffect() {
    const particles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1,
        color: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#22c55e', '#06b6d4'][i % 6],
        size: Math.random() * 8 + 4,
    }));

    return (
        <div className="fixed inset-0 pointer-events-none z-50">
            {particles.map(p => (
                <div
                    key={p.id}
                    className="absolute animate-confetti"
                    style={{
                        left: `${p.left}%`, top: -20,
                        width: p.size, height: p.size,
                        backgroundColor: p.color,
                        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                        animationDelay: `${p.delay}s`,
                        animationDuration: `${2 + Math.random() * 2}s`,
                    }}
                />
            ))}
        </div>
    );
}

export default function FeedbackPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [selectedEmoji, setSelectedEmoji] = useState('');
    const [message, setMessage] = useState('');
    const [category, setCategory] = useState('general');
    const [npsScore, setNpsScore] = useState(7);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [showConfetti, setShowConfetti] = useState(false);

    // Live sentiment analysis
    const sentimentResult = useMemo(() => {
        if (message.trim().length < 5) return null;
        return analyzeSentiment(message);
    }, [message]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rating) { setError('Please select a star rating'); return; }
        if (!isAnonymous && !name.trim()) { setError('Please enter your name'); return; }
        if (!message.trim()) { setError('Please write your feedback'); return; }
        if (message.trim().length < 20) { setError('Please write at least 20 characters'); return; }

        setSubmitting(true);
        setError('');

        try {
            const sentiment = sentimentResult || analyzeSentiment(message);
            const res = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: isAnonymous ? 'Anonymous' : name.trim(),
                    email: isAnonymous ? null : (email.trim() || null),
                    rating, emoji: selectedEmoji || null,
                    message: message.trim(), category,
                    sentiment: sentiment.sentiment,
                    sentiment_score: sentiment.score,
                    tags: sentiment.tags,
                    nps_score: npsScore,
                    is_anonymous: isAnonymous,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to submit');
            }

            setSubmitted(true);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#0a0f1e] relative overflow-hidden">
            {showConfetti && <ConfettiEffect />}
            <div className="absolute inset-0 bg-grid opacity-30" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-600/[0.07] rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-purple-600/[0.05] rounded-full blur-[100px] pointer-events-none" />

            {/* Nav */}
            <div className="relative z-10 border-b border-white/5 bg-[#0a0f1e]/80 backdrop-blur-xl">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-blue-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                            <img src="/logo.png" alt="NextGen Labs" className="relative w-8 h-8 rounded-xl object-contain" />
                        </div>
                        <span className="gradient-text-premium font-black text-lg tracking-tight hidden sm:block">NextGen Labs</span>
                    </Link>
                    <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </Link>
                </div>
            </div>

            <div className="relative z-10 max-w-2xl mx-auto px-4 py-12 sm:py-20">
                <AnimatePresence mode="wait">
                    {submitted ? (
                        <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="text-center py-16">
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }} className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center">
                                <svg className="w-12 h-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </motion.div>
                            <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="text-3xl font-bold text-white mb-3">Thank You! 🎉</motion.h2>
                            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="text-gray-400 text-lg mb-8 max-w-md mx-auto">Your feedback has been submitted and will be reviewed by our team.</motion.p>
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="flex items-center justify-center gap-4">
                                <Link href="/" className="px-6 py-3 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/25">Back to Home</Link>
                                <button onClick={() => { setSubmitted(false); setName(''); setEmail(''); setRating(0); setSelectedEmoji(''); setMessage(''); setCategory('general'); setNpsScore(7); }} className="px-6 py-3 rounded-xl font-semibold text-sm text-gray-300 border border-white/10 hover:border-white/20 hover:text-white transition-all cursor-pointer">Submit Another</button>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
                            {/* Header */}
                            <div className="text-center mb-10">
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 mb-4">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                                    <span className="text-blue-400 text-xs font-semibold tracking-wider uppercase">Share Your Experience</span>
                                </motion.div>
                                <h1 className="text-4xl sm:text-5xl font-black text-white mb-3 tracking-tight">
                                    We Value Your{' '}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Feedback</span>
                                </h1>
                                <p className="text-gray-400 text-lg max-w-lg mx-auto">Help us improve the Resume Builder by sharing your thoughts.</p>
                            </div>

                            {/* Form Card */}
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/10 to-pink-600/20 rounded-3xl blur-xl" />
                                <div className="relative rounded-2xl border border-white/10 bg-[#0a0f1e]/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
                                    <form onSubmit={handleSubmit} className="space-y-7">

                                        {/* Category Selector */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-3">What&apos;s this about?</label>
                                            <div className="flex flex-wrap gap-2">
                                                {CATEGORIES.map(cat => (
                                                    <button key={cat.value} type="button" onClick={() => setCategory(cat.value)}
                                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${category === cat.value
                                                            ? 'bg-blue-500/20 border-2 border-blue-400/50 text-blue-300 shadow-lg shadow-blue-500/10'
                                                            : 'bg-white/[0.03] border border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-300'}`}>
                                                        <span>{cat.icon}</span>{cat.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Star Rating */}
                                        <div className="text-center">
                                            <label className="block text-sm font-semibold text-gray-300 mb-4">How would you rate your experience?</label>
                                            <div className="flex justify-center"><StarRating rating={rating} setRating={setRating} hovered={hovered} setHovered={setHovered} /></div>
                                            <AnimatePresence>
                                                {(hovered || rating) > 0 && (
                                                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-sm mt-2 text-yellow-400/80 font-medium">
                                                        {RATING_LABELS[hovered || rating]}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Emoji */}
                                        <div className="text-center">
                                            <label className="block text-sm font-semibold text-gray-300 mb-3">Quick reaction <span className="text-gray-500 font-normal">(optional)</span></label>
                                            <div className="flex items-center justify-center gap-2 flex-wrap">
                                                {EMOJIS.map(({ emoji, label }) => (
                                                    <motion.button key={emoji} type="button" whileHover={{ scale: 1.2, y: -4 }} whileTap={{ scale: 0.9 }}
                                                        onClick={() => setSelectedEmoji(selectedEmoji === emoji ? '' : emoji)}
                                                        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl transition-all duration-200 cursor-pointer ${selectedEmoji === emoji
                                                            ? 'bg-blue-500/20 border-2 border-blue-400/50 shadow-lg shadow-blue-500/20'
                                                            : 'bg-white/[0.03] border border-white/10 hover:border-white/20'}`}
                                                        title={label}>{emoji}</motion.button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="border-t border-white/5" />

                                        {/* Anonymous Toggle */}
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-400">Submit anonymously</span>
                                            <button type="button" onClick={() => setIsAnonymous(!isAnonymous)}
                                                className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${isAnonymous ? 'bg-blue-500' : 'bg-gray-700'}`}>
                                                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow-md ${isAnonymous ? 'left-[22px]' : 'left-0.5'}`} />
                                            </button>
                                        </div>

                                        {/* Name & Email */}
                                        {!isAnonymous && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Your Name <span className="text-red-400">*</span></label>
                                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe"
                                                        className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all text-sm" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Email <span className="text-gray-600">(optional)</span></label>
                                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com"
                                                        className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all text-sm" />
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Message */}
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Your Feedback <span className="text-red-400">*</span></label>
                                                <div className="flex items-center gap-2">
                                                    {sentimentResult && (
                                                        <span className="text-xs text-gray-500">
                                                            {getSentimentEmoji(sentimentResult.sentiment)} {sentimentResult.sentiment}
                                                        </span>
                                                    )}
                                                    <span className={`text-xs ${message.length < 20 ? 'text-gray-600' : message.length > 450 ? 'text-amber-400' : 'text-gray-500'}`}>
                                                        {message.length}/500
                                                    </span>
                                                </div>
                                            </div>
                                            <textarea value={message} onChange={(e) => { if (e.target.value.length <= 500) setMessage(e.target.value); }}
                                                placeholder="Tell us about your experience with the Resume Builder..." required rows={4}
                                                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all text-sm resize-none" />

                                            {/* Auto-detected tags */}
                                            {sentimentResult && sentimentResult.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                    {sentimentResult.tags.map(tag => (
                                                        <span key={tag} className="px-2 py-0.5 text-[10px] font-medium text-blue-300/70 bg-blue-500/10 border border-blue-500/20 rounded-full">#{tag}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* NPS Slider */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-3">
                                                How likely are you to recommend us? <span className="text-gray-500 font-normal">(0-10)</span>
                                            </label>
                                            <div className="px-1">
                                                <input type="range" min="0" max="10" value={npsScore} onChange={(e) => setNpsScore(parseInt(e.target.value))} className="nps-slider w-full" />
                                                <div className="flex justify-between mt-1.5">
                                                    {Array.from({ length: 11 }, (_, i) => (
                                                        <span key={i} className={`text-[10px] font-medium ${npsScore === i ? 'text-white' : 'text-gray-600'}`}>{i}</span>
                                                    ))}
                                                </div>
                                                <p className={`text-xs mt-1 font-medium ${npsScore >= 9 ? 'text-green-400' : npsScore >= 7 ? 'text-blue-400' : npsScore >= 5 ? 'text-yellow-400' : 'text-red-400'}`}>
                                                    {npsScore >= 9 ? '🎉 Promoter' : npsScore >= 7 ? '😊 Satisfied' : npsScore >= 5 ? '😐 Neutral' : '😔 Needs Improvement'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Error */}
                                        <AnimatePresence>
                                            {error && (
                                                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                                    </svg>
                                                    {error}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Submit */}
                                        <motion.button type="submit" disabled={submitting} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                                            className="w-full py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2">
                                            {submitting ? (
                                                <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Submitting...</>
                                            ) : (
                                                <><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>Submit Feedback</>
                                            )}
                                        </motion.button>
                                    </form>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
