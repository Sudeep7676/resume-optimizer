'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import Link from 'next/link';

interface Feedback {
    id: string;
    name: string;
    rating: number;
    emoji: string | null;
    message: string;
    category?: string;
    is_featured?: boolean;
    created_at: string;
}

interface Stats {
    total: number;
    avgRating: number;
}

const CATEGORY_COLORS: Record<string, string> = {
    general: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    ui_design: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    resume_quality: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    feature_request: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    bug_report: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const CATEGORY_LABELS: Record<string, string> = {
    general: 'General',
    ui_design: 'UI/Design',
    resume_quality: 'Resume Quality',
    feature_request: 'Feature Request',
    bug_report: 'Bug Report',
};

function StarDisplay({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-700'}`}
                    fill={star <= rating ? 'currentColor' : 'none'}
                    stroke="currentColor" viewBox="0 0 24 24"
                    strokeWidth={star <= rating ? 0 : 1.5}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
            ))}
        </div>
    );
}

function TestimonialCard({ feedback }: { feedback: Feedback }) {
    const initial = feedback.name.charAt(0).toUpperCase();
    const colors = [
        'from-blue-500 to-cyan-500',
        'from-purple-500 to-pink-500',
        'from-emerald-500 to-teal-500',
        'from-orange-500 to-amber-500',
        'from-rose-500 to-red-500',
    ];
    const colorIndex = feedback.name.charCodeAt(0) % colors.length;
    const isFeatured = feedback.is_featured;

    return (
        <div className="flex-shrink-0 w-[320px] sm:w-[360px]">
            <div className={`relative overflow-hidden rounded-2xl border ${isFeatured ? 'border-yellow-500/30 featured-glow' : 'border-white/10'} bg-white/[0.03] backdrop-blur-xl p-6 h-full hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 group`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                <div className="relative z-10">
                    {/* Featured Badge */}
                    {isFeatured && (
                        <div className="absolute -top-1 -right-1 px-2 py-0.5 rounded-bl-lg rounded-tr-xl bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-b border-l border-yellow-500/30">
                            <span className="text-[10px] font-bold text-yellow-400">⭐ Featured</span>
                        </div>
                    )}

                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${colors[colorIndex]} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                                {initial}
                            </div>
                            <div>
                                <h4 className="text-white font-semibold text-sm">{feedback.name}</h4>
                                <p className="text-gray-500 text-xs">
                                    {new Date(feedback.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                        {feedback.emoji && <span className="text-2xl">{feedback.emoji}</span>}
                    </div>

                    {/* Rating + Category */}
                    <div className="flex items-center gap-2 mb-3">
                        <StarDisplay rating={feedback.rating} />
                        {feedback.category && feedback.category !== 'general' && (
                            <span className={`px-1.5 py-0.5 text-[9px] font-semibold rounded-full border ${CATEGORY_COLORS[feedback.category] || CATEGORY_COLORS.general}`}>
                                {CATEGORY_LABELS[feedback.category] || feedback.category}
                            </span>
                        )}
                    </div>

                    {/* Message */}
                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">&ldquo;{feedback.message}&rdquo;</p>
                </div>

                <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
        </div>
    );
}

export default function TestimonialsSection() {
    const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);
    const controls = useAnimationControls();

    useEffect(() => {
        async function fetchData() {
            try {
                const [fbRes, statsRes] = await Promise.all([
                    fetch('/api/feedback?approved=true'),
                    fetch('/api/feedback/stats'),
                ]);
                if (fbRes.ok) {
                    const fbData = await fbRes.json();
                    setFeedbackList(fbData.feedback || []);
                }
                if (statsRes.ok) {
                    const statsData = await statsRes.json();
                    setStats({ total: statsData.total, avgRating: statsData.avgRating });
                }
            } catch {
                // Silently fail
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Auto-scroll animation
    useEffect(() => {
        if (feedbackList.length <= 2 || !scrollRef.current) return;
        const cardWidth = 376;
        const totalWidth = cardWidth * feedbackList.length;
        controls.start({
            x: -totalWidth,
            transition: { x: { repeat: Infinity, repeatType: 'loop', duration: feedbackList.length * 6, ease: 'linear' } },
        });
        return () => controls.stop();
    }, [feedbackList, controls]);

    if (loading) return null;
    if (feedbackList.length === 0) {
        return (
            <section className="py-24 relative" id="testimonials">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                        <span className="text-blue-400 text-xs font-semibold tracking-wider uppercase">Testimonials</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
                        What Users <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 italic">Say</span>
                    </h2>
                    <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">Be the first to share your experience!</p>
                    <Link href="/feedback" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/25">
                        Share Your Feedback
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 relative overflow-hidden" id="testimonials">
            <div className="max-w-6xl mx-auto px-4 mb-12">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                    className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 mb-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                            <span className="text-blue-400 text-xs font-semibold tracking-wider uppercase">Testimonials</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
                            What Users <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 italic">Say</span>
                        </h2>
                        <div className="flex items-center gap-3 mt-1">
                            <p className="text-gray-400 text-lg">Real feedback from our community.</p>
                            {stats && stats.total > 0 && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                    </svg>
                                    <span className="text-yellow-300 text-sm font-bold">{stats.avgRating}</span>
                                    <span className="text-yellow-400/60 text-xs">from {stats.total} reviews</span>
                                </span>
                            )}
                        </div>
                    </div>
                    <Link href="/feedback" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/25 shrink-0">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Leave Feedback
                    </Link>
                </motion.div>
            </div>

            <div className="relative" ref={scrollRef}>
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0a0f1e] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0a0f1e] to-transparent z-10 pointer-events-none" />
                <div className="overflow-hidden">
                    <motion.div className="flex gap-4 pl-4" animate={controls}
                        onHoverStart={() => controls.stop()}
                        onHoverEnd={() => {
                            if (feedbackList.length > 2) {
                                const cardWidth = 376;
                                const totalWidth = cardWidth * feedbackList.length;
                                controls.start({
                                    x: -totalWidth,
                                    transition: { x: { repeat: Infinity, repeatType: 'loop', duration: feedbackList.length * 6, ease: 'linear' } },
                                });
                            }
                        }}>
                        {[...feedbackList, ...feedbackList].map((fb, i) => (
                            <TestimonialCard key={`${fb.id}-${i}`} feedback={fb} />
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
