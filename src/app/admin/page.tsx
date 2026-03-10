'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import type { Submission } from '@/types/resume';

export default function AdminPage() {
    const [authenticated, setAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [adminKey, setAdminKey] = useState('');
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [selectedLatex, setSelectedLatex] = useState<string | null>(null);

    const fetchSubmissions = useCallback(async (key: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/submissions?key=${encodeURIComponent(key)}`);
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setSubmissions(data.submissions || []);
        } catch {
            setError('Failed to load submissions');
        } finally {
            setLoading(false);
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
            } else {
                setError('Incorrect admin password');
            }
        } catch {
            setError('Login failed');
        }
    };

    const handleDelete = async (id: string) => {
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

    const filteredSubmissions = submissions.filter(s =>
        s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        s.email?.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        // Check if already authenticated via cookie
        if (authenticated && adminKey) {
            fetchSubmissions(adminKey);
        }
    }, [authenticated, adminKey, fetchSubmissions]);

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

    return (
        <main className="min-h-screen bg-[#0a0f1e]">
            {/* Header */}
            <div className="border-b border-white/5 bg-[#0a0f1e]/80 backdrop-blur-xl sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-lg font-bold text-white">📊 Admin Dashboard</h1>
                    <span className="text-gray-500 text-sm">{submissions.length} submissions</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Search */}
                <div className="mb-6">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or email..."
                        className="w-full max-w-md px-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>

                {loading ? (
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
                                                    onClick={() => handleDelete(sub.id)}
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
            </div>
        </main>
    );
}
