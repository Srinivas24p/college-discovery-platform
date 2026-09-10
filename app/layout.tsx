import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { CompareProvider } from "@/components/compare/CompareContext";
import FloatingCompareBar from "@/components/compare/FloatingCompareBar";

export const metadata: Metadata = {
  title: "CampusFind — Indian College Discovery, Comparison & Admission Predictor",
  description:
    "Explore top Indian colleges, analyze tuition fees, verified placements, NIRF rankings, and predict admission chances using competitive exam ranks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans">
        <CompareProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingCompareBar />
        </CompareProvider>
      </body>
    </html>
  );
}
