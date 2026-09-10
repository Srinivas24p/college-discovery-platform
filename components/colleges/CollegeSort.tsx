"use client";

import { useState } from "react";

interface CollegeSortProps {
  sortBy: string;
  onSortChange: (newSort: string) => void;
  isLoading: boolean;
  totalCount: number;
  searchValue?: string;
  onSearchSubmit?: (search: string) => void;
}

const SORT_OPTIONS = [
  { label: "Highest Rated (Default)", value: "rating" },
  { label: "Fees: Low to High", value: "fee_asc" },
  { label: "Fees: High to Low", value: "fee_desc" },
  { label: "NIRF Ranking (Top Ranks)", value: "nirf" },
  { label: "College Name (A–Z)", value: "name" },
];

export default function CollegeSort({
  sortBy,
  onSortChange,
  isLoading,
  totalCount,
  searchValue = "",
  onSearchSubmit,
}: CollegeSortProps) {
  const [prevSearch, setPrevSearch] = useState(searchValue);
  const [localSearch, setLocalSearch] = useState(searchValue);

  // Sync external search updates (e.g. filter reset) without cascading renders
  if (searchValue !== prevSearch) {
    setPrevSearch(searchValue);
    setLocalSearch(searchValue);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(localSearch);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      {/* Search within results input */}
      {onSearchSubmit && (
        <form onSubmit={handleSubmit} className="relative flex-1 max-w-md">
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search within colleges, locations..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 pl-8 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
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
      )}

      {/* Result Count and Sort Select */}
      <div className="flex flex-wrap items-center justify-between md:justify-end gap-4">
        <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
          Showing <span className="font-bold text-slate-900 dark:text-white">{totalCount}</span>{" "}
          {totalCount === 1 ? "college" : "colleges"}
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="sort-select"
            className="text-xs font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap"
          >
            Sort by:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            disabled={isLoading}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-900 shadow-xs focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
