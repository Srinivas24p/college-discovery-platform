"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCompare } from "@/components/compare/CompareContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { compareIds } = useCompare();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState("");

  const navLinks = [
    { label: "Explore Colleges", href: "/colleges" },
    { label: "Compare", href: "/compare", count: compareIds.length },
    { label: "College Predictor", href: "/predictor" },
  ];

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      router.push(`/colleges?search=${encodeURIComponent(quickSearch.trim())}`);
      setQuickSearch("");
      setMobileMenuOpen(false);
    } else {
      router.push("/colleges");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-slate-800 dark:bg-slate-900/95 transition-colors shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700 text-white font-bold shadow-xs group-hover:bg-blue-800 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                Campus<span className="text-blue-700 dark:text-blue-400">Find</span>
              </span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 tracking-wider uppercase mt-0.5">
                Indian Higher Education
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-800 font-semibold dark:bg-blue-950/60 dark:text-blue-300"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                  }`}
                >
                  {link.label}
                  {link.count !== undefined && link.count > 0 && (
                    <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-bold text-white leading-none">
                      {link.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Side: Quick Search & Login Placeholder */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Quick Search Form */}
          <form onSubmit={handleQuickSearch} className="relative">
            <input
              type="text"
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              placeholder="Search colleges, cities..."
              className="w-48 lg:w-60 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 pl-8 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white transition-all"
            />
            <svg
              className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </form>

          {/* Login Placeholder button */}
          <button
            type="button"
            onClick={() => alert("Student Portal authentication is coming in the next release. Explore colleges, compare metrics, and predict admission chances right away!")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 text-slate-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Login</span>
          </button>
        </div>

        {/* Mobile: Hamburger Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 dark:border-slate-800 dark:bg-slate-900 space-y-3">
          {/* Mobile Quick Search */}
          <form onSubmit={handleQuickSearch} className="relative">
            <input
              type="text"
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              placeholder="Search colleges, courses or locations..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 pl-9 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <svg
              className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </form>

          {/* Mobile Nav Links */}
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-800 font-semibold dark:bg-blue-950/60 dark:text-blue-300"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  }`}
                >
                  <span>{link.label}</span>
                  {link.count !== undefined && link.count > 0 && (
                    <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">
                      {link.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Login Placeholder */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                alert("Student Portal authentication is coming in the next release. Explore colleges, compare metrics, and predict admission chances right away!");
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <span>👤 Student Login (Demo)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
