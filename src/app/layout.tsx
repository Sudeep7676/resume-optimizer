import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resume Optimizer | NextGen Labs Pvt Ltd",
  description:
    "Build a recruiter-ready resume with structured AI prompts and professional LaTeX workflow. Powered by NextGen Labs.",
  keywords: ["resume", "LaTeX", "AI", "resume builder", "ATS", "NextGen Labs"],
  authors: [{ name: "NextGen Labs Pvt Ltd" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
