'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-300">
                {label}
            </label>
            <input
                className={`w-full px-4 py-2.5 bg-gray-900/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 ${error ? 'border-red-500' : 'border-gray-700'
                    } ${className}`}
                {...props}
            />
            {error && (
                <p className="text-xs text-red-400 mt-0.5">{error}</p>
            )}
        </div>
    );
}
