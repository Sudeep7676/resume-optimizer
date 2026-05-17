'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useResumeStore } from '@/store/useResumeStore';
import Button from '@/components/ui/Button';
import CodeBlock from '@/components/ui/CodeBlock';
import Toast from '@/components/ui/Toast';
import ResumeFeedback from '@/components/ui/ResumeFeedback';
import Link from 'next/link';

export default function PreviewPage() {
    const router = useRouter();
    const store = useResumeStore();
    const [copied, setCopied] = useState(false);
    const [regenerating, setRegenerating] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [showToast, setShowToast] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(store.generatedLatex);
            setCopied(true);
            setToastMsg('LaTeX code copied to clipboard!');
            setToastType('success');
            setShowToast(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            setToastMsg('Failed to copy. Please select and copy manually.');
            setToastType('error');
            setShowToast(true);
        }
    }, [store.generatedLatex]);

    const handleRegenerate = async () => {
        setRegenerating(true);
        try {
            const res = await fetch('/api/generate-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(store.formData),
            });
            if (!res.ok) throw new Error('Failed to regenerate');
            const data = await res.json();
            store.setGeneratedLatex(data.latex);
            store.setTokensUsed(data.tokensUsed);
            store.setGenerationTime(data.generationTime);
            setToastMsg('Resume regenerated successfully!');
            setToastType('success');
            setShowToast(true);
        } catch {
            setToastMsg('Failed to regenerate. Please try again.');
            setToastType('error');
            setShowToast(true);
        } finally {
            setRegenerating(false);
        }
    };

    if (!store.generatedLatex) {
        return (
            <main className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">No Resume Generated Yet</h2>
                    <p className="text-gray-400 mb-6">Fill out the form first to generate your LaTeX resume.</p>
                    <Link href="/resume/enroll" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-medium">
                        Go to Form →
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#0a0f1e]">
            {/* Header */}
            <div className="border-b border-white/5 bg-[#0a0f1e]/80 backdrop-blur-xl sticky top-0 z-40">
                <div className="max-w-[1600px] mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <img src="/logo.png" alt="NextGen Labs" className="w-8 h-8 rounded-lg object-contain" />
                        <span className="text-white font-semibold hidden sm:block">Resume Preview</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        {store.tokensUsed > 0 && (
                            <span className="px-2 py-1 text-xs text-gray-400 bg-white/5 rounded-md">{store.tokensUsed} tokens</span>
                        )}
                        {store.generationTime > 0 && (
                            <span className="px-2 py-1 text-xs text-gray-400 bg-white/5 rounded-md">{(store.generationTime / 1000).toFixed(1)}s</span>
                        )}
                        {/* Feedback Toggle Button */}
                        <motion.button
                            onClick={() => setShowFeedback(!showFeedback)}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className={`px-4 py-2 rounded-xl text-sm font-bold cursor-pointer flex items-center gap-2 transition-all ${
                                showFeedback
                                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                    : 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            {showFeedback ? 'Hide Suggestions' : '💡 Get Improvement Suggestions'}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Two-column layout */}
            <div className="flex min-h-[calc(100vh-65px)]">
                {/* LEFT: Feedback Panel (slide-in) */}
                <AnimatePresence>
                    {showFeedback && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 480, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="shrink-0 border-r border-white/5 bg-[#080c18] overflow-hidden"
                        >
                            <div className="w-[480px] h-full overflow-y-auto">
                                <ResumeFeedback
                                    formData={store.formData as unknown as Record<string, unknown>}
                                    isVisible={true}
                                    onClose={() => setShowFeedback(false)}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* RIGHT: LaTeX Code */}
                <div className="flex-1 min-w-0">
                    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white">📝 LaTeX Output</h3>
                            </div>

                            <CodeBlock code={store.generatedLatex} language="latex" />

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                                <Button variant="primary" onClick={handleCopy} className="w-full" type="button">
                                    {copied ? '✓ Copied!' : '📋 Copy LaTeX'}
                                </Button>
                                <Button variant="outline" onClick={() => window.open('https://www.overleaf.com/', '_blank')} className="w-full" type="button">
                                    🔗 Open Overleaf
                                </Button>
                                <Button variant="ghost" onClick={handleRegenerate} isLoading={regenerating} className="w-full" type="button">
                                    🔄 Regenerate
                                </Button>
                                <Button variant="ghost" onClick={() => router.push('/resume/enroll')} className="w-full" type="button">
                                    ✏️ Edit Details
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <Toast message={toastMsg} type={toastType} isVisible={showToast} onClose={() => setShowToast(false)} />
        </main>
    );
}
