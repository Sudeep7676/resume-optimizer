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
    created_at: string;
}

function StarDisplay({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-700'}`}
                    fill={star <= rating ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={star <= rating ? 0 : 1.5}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                    />
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

    return (
        <div className="flex-shrink-0 w-[320px] sm:w-[360px]">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 h-full hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${colors[colorIndex]} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                                {initial}
                            </div>
                            <div>
                                <h4 className="text-white font-semibold text-sm">{feedback.name}</h4>
                                <p className="text-gray-500 text-xs">
                                    {new Date(feedback.created_at).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>
                        {feedback.emoji && (
                            <span className="text-2xl" title="Reaction">
                                {feedback.emoji}
                            </span>
                        )}
                    </div>

                    {/* Rating */}
                    <div className="mb-3">
                        <StarDisplay rating={feedback.rating} />
                    </div>

                    {/* Message */}
                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">
                        &ldquo;{feedback.message}&rdquo;
                    </p>
                </div>

                {/* Subtle glow on hover */}
                <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
        </div>
    );
}

export default function TestimonialsSection() {
    const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);
    const controls = useAnimationControls();

    useEffect(() => {
        async function fetchFeedback() {
            try {
                const res = await fetch('/api/feedback?approved=true');
                if (res.ok) {
                    const data = await res.json();
                    setFeedbackList(data.feedback || []);
                }
            } catch {
                // Silently fail — section simply won't render
            } finally {
                setLoading(false);
            }
        }
        fetchFeedback();
    }, []);

    // Auto-scroll animation
    useEffect(() => {
        if (feedbackList.length <= 2 || !scrollRef.current) return;

        const cardWidth = 376; // card width + gap
        const totalWidth = cardWidth * feedbackList.length;

        controls.start({
            x: -totalWidth,
            transition: {
                x: {
                    repeat: Infinity,
                    repeatType: 'loop',
                    duration: feedbackList.length * 6,
                    ease: 'linear',
                },
            },
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
                        What Users{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 italic">Say</span>
                    </h2>
                    <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
                        Be the first to share your experience with the Resume Optimizer!
                    </p>
                    <Link
                        href="/feedback"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/25"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                        </svg>
                        Share Your Feedback
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 relative overflow-hidden" id="testimonials">
            <div className="max-w-6xl mx-auto px-4 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4"
                >
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 mb-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                            <span className="text-blue-400 text-xs font-semibold tracking-wider uppercase">Testimonials</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
                            What Users{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 italic">Say</span>
                        </h2>
                        <p className="text-gray-400 text-lg">
                            Real feedback from our community.
                        </p>
                    </div>
                    <Link
                        href="/feedback"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/25 shrink-0"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Leave Feedback
                    </Link>
                </motion.div>
            </div>

            {/* Scrolling testimonials */}
            <div className="relative" ref={scrollRef}>
                {/* Fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0a0f1e] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0a0f1e] to-transparent z-10 pointer-events-none" />

                <div className="overflow-hidden">
                    <motion.div
                        className="flex gap-4 pl-4"
                        animate={controls}
                        onHoverStart={() => controls.stop()}
                        onHoverEnd={() => {
                            if (feedbackList.length > 2) {
                                const cardWidth = 376;
                                const totalWidth = cardWidth * feedbackList.length;
                                controls.start({
                                    x: -totalWidth,
                                    transition: {
                                        x: {
                                            repeat: Infinity,
                                            repeatType: 'loop',
                                            duration: feedbackList.length * 6,
                                            ease: 'linear',
                                        },
                                    },
                                });
                            }
                        }}
                    >
                        {/* Duplicate items for seamless loop */}
                        {[...feedbackList, ...feedbackList].map((fb, i) => (
                            <TestimonialCard key={`${fb.id}-${i}`} feedback={fb} />
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
