'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useResumeStore } from '@/store/useResumeStore';
import Button from '@/components/ui/Button';
import CodeBlock from '@/components/ui/CodeBlock';
import Toast from '@/components/ui/Toast';
import Link from 'next/link';

export default function PreviewPage() {
    const router = useRouter();
    const store = useResumeStore();
    const [copied, setCopied] = useState(false);
    const [regenerating, setRegenerating] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [showToast, setShowToast] = useState(false);

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

    const handleOpenOverleaf = () => {
        window.open('https://www.overleaf.com/', '_blank');
    };

    if (!store.generatedLatex) {
        return (
            <main className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">No Resume Generated Yet</h2>
                    <p className="text-gray-400 mb-6">Fill out the form first to generate your LaTeX resume.</p>
                    <Link
                        href="/resume/enroll"
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-medium"
                    >
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
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <span className="text-white font-bold text-xs">iT</span>
                        </div>
                        <span className="text-white font-semibold hidden sm:block">Resume Preview</span>
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        {store.tokensUsed > 0 && (
                            <span className="px-2 py-1 bg-white/5 rounded-md">
                                {store.tokensUsed} tokens
                            </span>
                        )}
                        {store.generationTime > 0 && (
                            <span className="px-2 py-1 bg-white/5 rounded-md">
                                {(store.generationTime / 1000).toFixed(1)}s
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 gap-8">
                    {/* Right: LaTeX Code */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">📝 LaTeX Output</h3>
                        </div>

                        <CodeBlock code={store.generatedLatex} language="latex" />

                        <div className="grid grid-cols-2 gap-3 mt-4">
                            <Button
                                variant="primary"
                                onClick={handleCopy}
                                className="w-full"
                                type="button"
                            >
                                {copied ? '✓ Copied!' : '📋 Copy LaTeX'}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleOpenOverleaf}
                                className="w-full"
                                type="button"
                            >
                                🔗 Open Overleaf
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={handleRegenerate}
                                isLoading={regenerating}
                                className="w-full"
                                type="button"
                            >
                                🔄 Regenerate
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => router.push('/resume/enroll')}
                                className="w-full"
                                type="button"
                            >
                                ✏️ Edit Details
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>

            <Toast
                message={toastMsg}
                type={toastType}
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />
        </main>
    );
}
