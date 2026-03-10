'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function ContactSection() {
    return (
        <section className="py-24 relative" id="contact">
            <div className="max-w-6xl mx-auto px-4">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 relative z-10 items-center">
                    {/* Left Column - Contact Info */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 mb-4">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                                <span className="text-blue-400 text-xs font-semibold tracking-wider uppercase">Contact Us</span>
                            </div>
                            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
                                Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 italic">Touch</span>
                            </h2>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                Have questions about our programs, AI Resume Builder, or enterprise partnerships? We'd love to hear from you.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                                    <span className="text-xl">📧</span>
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold mb-1">Email Us (Any Queries)</h3>
                                    <a href="mailto:nextgenlabs.edu@gmail.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                                        nextgenlabs.edu@gmail.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                                    <span className="text-xl">🏢</span>
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold mb-1">Company</h3>
                                    <p className="text-gray-400">Developed by <span className="text-gray-300 font-medium">iTechNextGenSolutions Pvt Ltd</span></p>
                                    <p className="text-gray-400">Named by <span className="text-white font-bold tracking-tight">NextGen Labs</span></p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column - Contact Form UI */}
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-xl" />
                        <div className="relative rounded-2xl border border-white/10 bg-[#0a0f1e]/80 backdrop-blur-xl p-8 shadow-2xl">
                            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert('Message sent successfully! We will get back to you soon.'); }}>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">First Name</label>
                                        <input type="text" required placeholder="John" className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Last Name</label>
                                        <input type="text" required placeholder="Doe" className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors text-sm" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Email Address</label>
                                    <input type="email" required placeholder="john@example.com" className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Message</label>
                                    <textarea required rows={4} placeholder="How can we help you?" className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors text-sm resize-none" />
                                </div>
                                <button type="submit" className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/25">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
