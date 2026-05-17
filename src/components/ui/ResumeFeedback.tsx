'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedbackItem {
    category: string;
    icon: string;
    severity: 'critical' | 'warning' | 'suggestion' | 'good';
    title: string;
    description: string;
    fix?: string;
}

interface ScoreBreakdown {
    overall: number;
    content: number;
    formatting: number;
    impact: number;
    ats: number;
    completeness: number;
}

interface FeedbackData {
    scores: ScoreBreakdown;
    feedback: FeedbackItem[];
    summary: string;
    strengths: string[];
    topPriority: string;
    aiPowered: boolean;
}

interface ResumeFeedbackProps {
    formData: Record<string, unknown>;
    isVisible: boolean;
    onClose: () => void;
}

const SEV = {
    critical: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', label: 'Critical', dot: 'bg-red-400' },
    warning: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', label: 'Warning', dot: 'bg-amber-400' },
    suggestion: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', label: 'Tip', dot: 'bg-blue-400' },
    good: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', label: 'Strong', dot: 'bg-green-400' },
};

function ScoreRing({ score, label, size = 72 }: { score: number; label: string; size?: number }) {
    const r = (size - 8) / 2;
    const c = 2 * Math.PI * r;
    const off = c - (score / 100) * c;
    const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : score >= 40 ? '#f97316' : '#ef4444';
    return (
        <div className="flex flex-col items-center gap-1">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="-rotate-90">
                    <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3.5" />
                    <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round"
                        strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: off }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span className="text-sm font-bold text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>{score}</motion.span>
                </div>
            </div>
            <span className="text-[10px] text-gray-500 font-medium">{label}</span>
        </div>
    );
}

function ScoreBar({ label, score }: { label: string; score: number }) {
    const color = score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-amber-500' : score >= 40 ? 'bg-orange-500' : 'bg-red-500';
    return (
        <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-500 w-16 shrink-0">{label}</span>
            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div className={`h-full ${color} rounded-full`} initial={{ width: 0 }} animate={{ width: `${score}%` }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }} />
            </div>
            <span className="text-[10px] text-gray-400 font-medium w-7 text-right">{score}</span>
        </div>
    );
}

export default function ResumeFeedback({ formData, isVisible, onClose }: ResumeFeedbackProps) {
    const [data, setData] = useState<FeedbackData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

    const fetchFeedback = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/resume-feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error('Failed');
            setData(await res.json());
        } catch { setError('Failed to analyze. Try again.'); }
        finally { setLoading(false); }
    }, [formData]);

    useEffect(() => {
        if (isVisible && !data && !loading) fetchFeedback();
    }, [isVisible, data, loading, fetchFeedback]);

    const toggle = (i: number) => {
        setExpandedItems(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });
    };

    const filtered = data?.feedback.filter(f => activeFilter === 'all' || f.severity === activeFilter) || [];
    const counts = { critical: 0, warning: 0, suggestion: 0, good: 0 };
    data?.feedback.forEach(f => counts[f.severity]++);

    if (!isVisible) return null;

    return (
        <div className="p-5 h-full flex flex-col">
            {/* Panel Header */}
            <div className="flex items-center justify-between mb-5 shrink-0">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
                        <svg className="w-4.5 h-4.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">Improvement Suggestions</h3>
                        <p className="text-[10px] text-gray-500">{data?.aiPowered ? '✨ AI-Powered' : '📋 Smart Analysis'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5">
                    <button onClick={() => { setData(null); fetchFeedback(); }} disabled={loading}
                        className="p-1.5 text-gray-500 hover:text-white border border-white/10 rounded-lg transition-all cursor-pointer disabled:opacity-50" title="Re-analyze">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                    <button onClick={onClose} className="p-1.5 text-gray-500 hover:text-white cursor-pointer">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto min-h-0 space-y-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="w-10 h-10 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mb-4" />
                        <p className="text-gray-400 text-sm font-medium">Analyzing your resume...</p>
                        <p className="text-gray-600 text-xs mt-1">Checking 20+ quality signals</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-red-400 text-sm mb-3">{error}</p>
                        <button onClick={fetchFeedback} className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer">Try Again</button>
                    </div>
                ) : data ? (
                    <>
                        {/* Overall Score */}
                        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                            <div className="flex items-center gap-4 mb-4">
                                <ScoreRing score={data.scores.overall} label="Overall" size={80} />
                                <div className="flex-1 space-y-1.5">
                                    <ScoreBar label="Content" score={data.scores.content} />
                                    <ScoreBar label="Impact" score={data.scores.impact} />
                                    <ScoreBar label="ATS" score={data.scores.ats} />
                                    <ScoreBar label="Complete" score={data.scores.completeness} />
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed">{data.summary}</p>
                        </div>

                        {/* Top Priority */}
                        {data.topPriority && (
                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
                                className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20">
                                <span className="text-sm mt-0.5">🎯</span>
                                <div>
                                    <span className="text-[10px] font-bold text-amber-400 uppercase">Top Priority</span>
                                    <p className="text-xs text-amber-300/80 mt-0.5">{data.topPriority}</p>
                                </div>
                            </motion.div>
                        )}

                        {/* Strengths */}
                        {data.strengths.length > 0 && (
                            <div className="rounded-xl border border-green-500/10 bg-green-500/[0.02] p-3">
                                <h4 className="text-[10px] font-bold text-green-400 uppercase tracking-wider mb-2">✅ Strengths</h4>
                                <div className="space-y-1">
                                    {data.strengths.map((s, i) => (
                                        <p key={i} className="text-[11px] text-green-300/70 flex items-start gap-1.5">
                                            <span className="text-green-400 mt-0.5">•</span>{s}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Filter Pills */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                            {[
                                { key: 'all', label: `All (${data.feedback.length})` },
                                ...(counts.critical > 0 ? [{ key: 'critical', label: `🔴 ${counts.critical}` }] : []),
                                ...(counts.warning > 0 ? [{ key: 'warning', label: `🟡 ${counts.warning}` }] : []),
                                ...(counts.suggestion > 0 ? [{ key: 'suggestion', label: `🔵 ${counts.suggestion}` }] : []),
                                ...(counts.good > 0 ? [{ key: 'good', label: `🟢 ${counts.good}` }] : []),
                            ].map(f => (
                                <button key={f.key} onClick={() => setActiveFilter(f.key)}
                                    className={`px-2.5 py-1 text-[10px] font-semibold rounded-lg transition-all cursor-pointer ${activeFilter === f.key
                                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                        : 'text-gray-600 hover:text-gray-400 border border-transparent'}`}>
                                    {f.label}
                                </button>
                            ))}
                        </div>

                        {/* Feedback Items */}
                        <div className="space-y-2">
                            {filtered.map((item, i) => {
                                const cfg = SEV[item.severity];
                                const open = expandedItems.has(i);
                                return (
                                    <motion.div key={i}
                                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        onClick={() => toggle(i)}
                                        className={`rounded-xl border ${cfg.border} ${cfg.bg} p-3 cursor-pointer hover:brightness-110 transition-all`}
                                    >
                                        <div className="flex items-start gap-2.5">
                                            <span className="text-base mt-0.5 shrink-0">{item.icon}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5 mb-0.5">
                                                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                                                        <span className={`w-1 h-1 rounded-full ${cfg.dot}`} />{cfg.label}
                                                    </span>
                                                    <span className="text-[9px] text-gray-600">{item.category}</span>
                                                </div>
                                                <h4 className="text-xs font-semibold text-white leading-snug">{item.title}</h4>
                                                <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{item.description}</p>

                                                <AnimatePresence>
                                                    {open && item.fix && (
                                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                                            className="mt-2 overflow-hidden">
                                                            <div className="px-2.5 py-2 rounded-lg bg-blue-500/5 border border-blue-500/15">
                                                                <span className="text-[9px] font-bold text-blue-400 uppercase">💡 How to fix</span>
                                                                <p className="text-[11px] text-blue-300/70 mt-0.5">{item.fix}</p>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                            {item.fix && (
                                                <svg className={`w-3.5 h-3.5 text-gray-600 shrink-0 mt-1 transition-transform ${open ? 'rotate-180' : ''}`}
                                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {filtered.length === 0 && (
                            <p className="text-center text-gray-600 text-xs py-6">No items in this category</p>
                        )}
                    </>
                ) : null}
            </div>
        </div>
    );
}
