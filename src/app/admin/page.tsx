'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import type { Submission } from '@/types/resume';

interface FeedbackItem {
    id: string;
    name: string;
    email: string | null;
    rating: number;
    emoji: string | null;
    message: string;
    is_approved: boolean;
    created_at: string;
}

function StarDisplay({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={`w-3.5 h-3.5 ${star <= rating ? 'text-yellow-400' : 'text-gray-700'}`}
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

export default function AdminPage() {
    const [authenticated, setAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [adminKey, setAdminKey] = useState('');
    const [activeTab, setActiveTab] = useState<'submissions' | 'feedback'>('submissions');

    // Submissions state
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loadingSubs, setLoadingSubs] = useState(false);
    const [selectedLatex, setSelectedLatex] = useState<string | null>(null);

    // Feedback state
    const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
    const [loadingFeedback, setLoadingFeedback] = useState(false);

    // Shared state
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    const fetchSubmissions = useCallback(async (key: string) => {
        setLoadingSubs(true);
        try {
            const res = await fetch(`/api/admin/submissions?key=${encodeURIComponent(key)}`);
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setSubmissions(data.submissions || []);
        } catch {
            setError('Failed to load submissions');
        } finally {
            setLoadingSubs(false);
        }
    }, []);

    const fetchFeedback = useCallback(async (key: string) => {
        setLoadingFeedback(true);
        try {
            const res = await fetch(`/api/feedback?key=${encodeURIComponent(key)}`);
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setFeedbackList(data.feedback || []);
        } catch {
            setError('Failed to load feedback');
        } finally {
            setLoadingFeedback(false);
        }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            if (res.ok) {
                setAuthenticated(true);
                setAdminKey(password);
                fetchSubmissions(password);
                fetchFeedback(password);
            } else {
                setError('Incorrect password');
            }
        } catch {
            setError('Login failed');
        }
    };

    const handleDeleteSubmission = async (id: string) => {
        if (!confirm('Are you sure you want to delete this submission?')) return;
        try {
            const res = await fetch(`/api/admin/submissions?key=${encodeURIComponent(adminKey)}&id=${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setSubmissions(submissions.filter(s => s.id !== id));
            }
        } catch {
            setError('Failed to delete');
        }
    };

    const handleToggleApproval = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`/api/feedback?key=${encodeURIComponent(adminKey)}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, is_approved: !currentStatus }),
            });
            if (res.ok) {
                setFeedbackList(feedbackList.map(f =>
                    f.id === id ? { ...f, is_approved: !currentStatus } : f
                ));
            }
        } catch {
            setError('Failed to update feedback');
        }
    };

    const handleDeleteFeedback = async (id: string) => {
        if (!confirm('Are you sure you want to delete this feedback?')) return;
        try {
            const res = await fetch(`/api/feedback?key=${encodeURIComponent(adminKey)}&id=${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setFeedbackList(feedbackList.filter(f => f.id !== id));
            }
        } catch {
            setError('Failed to delete feedback');
        }
    };

    const filteredSubmissions = submissions.filter(s =>
        s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        s.email?.toLowerCase().includes(search.toLowerCase())
    );

    const filteredFeedback = feedbackList.filter(f =>
        f.name?.toLowerCase().includes(search.toLowerCase()) ||
        f.message?.toLowerCase().includes(search.toLowerCase())
    );

    // ─── Login Screen ────────────────────────────────────────────
    if (!authenticated) {
        return (
            <main className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8">
                        <h1 className="text-2xl font-bold text-white mb-2 text-center">Admin Dashboard</h1>
                        <p className="text-gray-400 text-sm text-center mb-6">Enter admin password to access submissions</p>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Admin password"
                                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                required
                            />
                            {error && <p className="text-red-400 text-sm">{error}</p>}
                            <Button variant="primary" className="w-full" type="submit">
                                🔑 Access Dashboard
                            </Button>
                        </form>
                    </div>
                </motion.div>
            </main>
        );
    }

    // ─── Dashboard ───────────────────────────────────────────────
    return (
        <main className="min-h-screen bg-[#0a0f1e]">
            {/* Header */}
            <div className="border-b border-white/5 bg-[#0a0f1e]/80 backdrop-blur-xl sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-lg font-bold text-white flex items-center gap-2.5">
                        <img src="/logo.png" alt="NextGen Labs" className="w-8 h-8 rounded-lg object-contain" />
                        Admin Dashboard
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-500 text-sm">
                            {activeTab === 'submissions'
                                ? `${submissions.length} submissions`
                                : `${feedbackList.length} feedback`
                            }
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Tab Switcher */}
                <div className="flex items-center gap-1 mb-6 p-1 rounded-xl bg-white/[0.03] border border-white/5 w-fit">
                    <button
                        onClick={() => { setActiveTab('submissions'); setSearch(''); }}
                        className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                            activeTab === 'submissions'
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                            Submissions
                        </span>
                    </button>
                    <button
                        onClick={() => { setActiveTab('feedback'); setSearch(''); }}
                        className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                            activeTab === 'feedback'
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                            </svg>
                            Feedback
                            {feedbackList.filter(f => !f.is_approved).length > 0 && (
                                <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                    {feedbackList.filter(f => !f.is_approved).length}
                                </span>
                            )}
                        </span>
                    </button>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={activeTab === 'submissions' ? 'Search by name or email...' : 'Search by name or message...'}
                        className="w-full max-w-md px-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>

                <AnimatePresence mode="wait">
                    {/* ─── Submissions Tab ─── */}
                    {activeTab === 'submissions' && (
                        <motion.div
                            key="submissions"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {loadingSubs ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto" />
                                    <p className="text-gray-400 mt-4">Loading submissions...</p>
                                </div>
                            ) : filteredSubmissions.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-400">No submissions found.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-white/5">
                                                <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
                                                <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
                                                <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                                                <th className="text-left py-3 px-4 text-gray-400 font-medium">Tokens</th>
                                                <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredSubmissions.map((sub) => (
                                                <tr key={sub.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                                    <td className="py-3 px-4 text-white font-medium">{sub.full_name}</td>
                                                    <td className="py-3 px-4 text-gray-400">{sub.email}</td>
                                                    <td className="py-3 px-4 text-gray-400">
                                                        {new Date(sub.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-400">{sub.tokens_used}</td>
                                                    <td className="py-3 px-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => setSelectedLatex(selectedLatex === sub.id ? null : sub.id)}
                                                                className="text-blue-400 hover:text-blue-300 text-xs cursor-pointer"
                                                            >
                                                                {selectedLatex === sub.id ? 'Hide LaTeX' : 'View LaTeX'}
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteSubmission(sub.id)}
                                                                className="text-red-400 hover:text-red-300 text-xs cursor-pointer"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {/* LaTeX Viewer */}
                                    {selectedLatex && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-4 p-4 rounded-xl border border-white/5 bg-[#0d1117]"
                                        >
                                            <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap overflow-auto max-h-[400px]">
                                                {submissions.find(s => s.id === selectedLatex)?.generated_latex || 'No LaTeX available'}
                                            </pre>
                                        </motion.div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ─── Feedback Tab ─── */}
                    {activeTab === 'feedback' && (
                        <motion.div
                            key="feedback"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* Stats row */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Total</p>
                                    <p className="text-2xl font-bold text-white">{feedbackList.length}</p>
                                </div>
                                <div className="rounded-xl border border-green-500/10 bg-green-500/[0.03] p-4">
                                    <p className="text-green-400/70 text-xs font-medium uppercase tracking-wider mb-1">Approved</p>
                                    <p className="text-2xl font-bold text-green-400">{feedbackList.filter(f => f.is_approved).length}</p>
                                </div>
                                <div className="rounded-xl border border-amber-500/10 bg-amber-500/[0.03] p-4">
                                    <p className="text-amber-400/70 text-xs font-medium uppercase tracking-wider mb-1">Pending</p>
                                    <p className="text-2xl font-bold text-amber-400">{feedbackList.filter(f => !f.is_approved).length}</p>
                                </div>
                                <div className="rounded-xl border border-yellow-500/10 bg-yellow-500/[0.03] p-4">
                                    <p className="text-yellow-400/70 text-xs font-medium uppercase tracking-wider mb-1">Avg Rating</p>
                                    <p className="text-2xl font-bold text-yellow-400">
                                        {feedbackList.length > 0
                                            ? (feedbackList.reduce((sum, f) => sum + f.rating, 0) / feedbackList.length).toFixed(1)
                                            : '—'
                                        }
                                    </p>
                                </div>
                            </div>

                            {loadingFeedback ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto" />
                                    <p className="text-gray-400 mt-4">Loading feedback...</p>
                                </div>
                            ) : filteredFeedback.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-400">No feedback found.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-white/5">
                                                <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
                                                <th className="text-left py-3 px-4 text-gray-400 font-medium">Rating</th>
                                                <th className="text-left py-3 px-4 text-gray-400 font-medium">Emoji</th>
                                                <th className="text-left py-3 px-4 text-gray-400 font-medium max-w-[300px]">Message</th>
                                                <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                                                <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                                                <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredFeedback.map((fb) => (
                                                <tr key={fb.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                                    <td className="py-3 px-4">
                                                        <div>
                                                            <p className="text-white font-medium">{fb.name}</p>
                                                            {fb.email && <p className="text-gray-500 text-xs">{fb.email}</p>}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <StarDisplay rating={fb.rating} />
                                                    </td>
                                                    <td className="py-3 px-4 text-xl">
                                                        {fb.emoji || '—'}
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-300 max-w-[300px]">
                                                        <p className="truncate" title={fb.message}>{fb.message}</p>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        {fb.is_approved ? (
                                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                                                Approved
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                                                Pending
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-400 text-xs whitespace-nowrap">
                                                        {new Date(fb.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-3 px-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => handleToggleApproval(fb.id, fb.is_approved)}
                                                                className={`text-xs cursor-pointer font-medium ${
                                                                    fb.is_approved
                                                                        ? 'text-amber-400 hover:text-amber-300'
                                                                        : 'text-green-400 hover:text-green-300'
                                                                }`}
                                                            >
                                                                {fb.is_approved ? 'Unapprove' : 'Approve'}
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteFeedback(fb.id)}
                                                                className="text-red-400 hover:text-red-300 text-xs cursor-pointer"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
