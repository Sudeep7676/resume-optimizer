'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import ThreeSteps from '@/components/landing/ThreeSteps';
import TemplatePreview from '@/components/landing/TemplatePreview';
import ExportGuide from '@/components/landing/ExportGuide';
import MoreTools from '@/components/landing/MoreTools';
import AboutSection from '@/components/landing/AboutSection';
import ContactSection from '@/components/landing/ContactSection';

const AnimatedBackground = dynamic(() => import('@/components/ui/AnimatedBackground'), {
  ssr: false,
});

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] relative">
      <AnimatedBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <Hero />
        <ThreeSteps />
        <TemplatePreview />
        <ExportGuide />
        <MoreTools />
        <AboutSection />
        <ContactSection />
        
        {/* Simple Footer */}
        <div className="w-full text-center py-6 border-t border-white/5 relative z-10 mt-auto">
            <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} NextGen Labs Pvt Ltd. All rights reserved.
            </p>
        </div>
      </div>
    </main>
  );
}
