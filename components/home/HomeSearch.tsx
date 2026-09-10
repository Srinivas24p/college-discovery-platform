"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomeSearch() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/colleges?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push("/colleges");
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="relative mx-auto flex w-full max-w-2xl items-center rounded-xl bg-white p-1.5 shadow-md border border-slate-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:focus-within:ring-blue-900/40 transition-all"
    >
      <div className="flex pl-3 text-slate-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
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
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search colleges, courses or locations (e.g. IIT Bombay, Delhi, Computer Science)"
        className="w-full bg-transparent px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
      />

      <button
        type="submit"
        className="inline-flex shrink-0 items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-800 transition-colors cursor-pointer"
      >
        Search Colleges
      </button>
    </form>
  );
}
