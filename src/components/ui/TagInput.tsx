'use client';

import React, { useState } from 'react';

interface TagInputProps {
    label: string;
    tags: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
    error?: string;
}

export default function TagInput({ label, tags, onChange, placeholder = 'Type and press Enter', error }: TagInputProps) {
    const [input, setInput] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.includes(',')) {
            const newTags = value
                .split(',')
                .map((t) => t.trim())
                .filter((t) => t && !tags.includes(t));

            if (newTags.length > 0) {
                onChange([...tags, ...newTags]);
            }
            setInput('');
        } else {
            setInput(value);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && input.trim()) {
            e.preventDefault();
            const newTags = input
                .split(',')
                .map((t) => t.trim())
                .filter((t) => t && !tags.includes(t));

            if (newTags.length > 0) {
                onChange([...tags, ...newTags]);
            }
            setInput('');
        }
        if (e.key === 'Backspace' && !input && tags.length > 0) {
            onChange(tags.slice(0, -1));
        }
    };

    const removeTag = (index: number) => {
        onChange(tags.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-300">{label}</label>
            <div
                className={`flex flex-wrap gap-2 p-2.5 bg-gray-900/50 border rounded-lg min-h-[44px] transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 ${error ? 'border-red-500' : 'border-gray-700'
                    }`}
            >
                {tags.map((tag, index) => (
                    <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-500/20 text-blue-400 rounded-md text-xs font-medium"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="hover:text-blue-200 transition-colors cursor-pointer"
                        >
                            ×
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={tags.length === 0 ? placeholder : ''}
                    className="flex-1 min-w-[120px] bg-transparent text-white placeholder-gray-500 outline-none text-sm"
                />
            </div>
            {error && <p className="text-xs text-red-400 mt-0.5">{error}</p>}
        </div>
    );
}
