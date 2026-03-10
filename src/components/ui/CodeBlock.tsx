'use client';

import React from 'react';

interface CodeBlockProps {
    code: string;
    language?: string;
}

export default function CodeBlock({ code, language = 'latex' }: CodeBlockProps) {
    return (
        <div className="relative rounded-xl overflow-hidden border border-gray-800 bg-[#0d1117]">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-900/80 border-b border-gray-800">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs text-gray-500 font-mono">{language}</span>
            </div>
            <pre className="p-4 overflow-x-auto text-sm leading-relaxed max-h-[600px] overflow-y-auto">
                <code className="font-mono text-gray-300 whitespace-pre">{code}</code>
            </pre>
        </div>
    );
}
