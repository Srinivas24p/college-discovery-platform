"use client";

import { useState } from "react";

export interface FilterState {
  search: string;
  state: string;
  city: string;
  ownership: string;
  degree: string;
  minFee: string;
  maxFee: string;
  minRating: string;
  feePreset: string;
}

interface CollegeFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onReset: () => void;
  isLoading: boolean;
  totalResults: number;
}

const POPULAR_STATES = [
  "All States",
  "Delhi",
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
  "Telangana",
  "Rajasthan",
];

const FEE_PRESETS = [
  { label: "All Fee Brackets", min: "", max: "", id: "all" },
  { label: "Under ₹2 Lakhs", min: "0", max: "200000", id: "under_2l" },
  { label: "₹2 Lakhs – ₹3 Lakhs", min: "200000", max: "300000", id: "2l_3l" },
  { label: "₹3 Lakhs – ₹5 Lakhs", min: "300000", max: "500000", id: "3l_5l" },
  { label: "Above ₹5 Lakhs", min: "500000", max: "", id: "above_5l" },
];

const RATING_OPTIONS = [
  { label: "Any Rating", value: "" },
  { label: "★ 4.0 & above", value: "4.0" },
  { label: "★ 4.5 & above", value: "4.5" },
  { label: "★ 4.8 & above", value: "4.8" },
];

const OWNERSHIP_OPTIONS = [
  { label: "All Ownerships", value: "" },
  { label: "Public / Govt", value: "PUBLIC" },
  { label: "Private", value: "PRIVATE" },
  { label: "Autonomous", value: "AUTONOMOUS" },
  { label: "Deemed University", value: "DEEMED" },
];

export default function CollegeFilters({
  filters,
  onFilterChange,
  onReset,
  isLoading,
  totalResults,
}: CollegeFiltersProps) {
  // Local state for instant keyword typing
  const [prevSearch, setPrevSearch] = useState(filters.search);
  const [searchInput, setSearchInput] = useState(filters.search);

  // Sync external filter changes (e.g. Reset) without useEffect
  if (filters.search !== prevSearch) {
    setPrevSearch(filters.search);
    setSearchInput(filters.search);
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ search: searchInput });
  };

  const handleFeePresetChange = (presetId: string) => {
    const selected = FEE_PRESETS.find((p) => p.id === presetId);
    if (selected) {
      onFilterChange({
        feePreset: presetId,
        minFee: selected.min,
        maxFee: selected.max,
      });
    }
  };

  const hasActiveFilters =
    Boolean(filters.search) ||
    Boolean(filters.state) ||
    Boolean(filters.city) ||
    Boolean(filters.ownership) ||
    Boolean(filters.degree) ||
    Boolean(filters.minFee) ||
    Boolean(filters.maxFee) ||
    Boolean(filters.minRating);

  return (
    <aside className="w-full space-y-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Header with Active Filters Indicator and Reset */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Filter Colleges
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {totalResults} {totalResults === 1 ? "match" : "matches"} found
          </span>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            disabled={isLoading}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 disabled:opacity-50 transition-colors"
          >
            Reset All
          </button>
        )}
      </div>

      {/* 1. Keyword Search */}
      <div className="space-y-2">
        <label
          htmlFor="college-search"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
        >
          Keyword Search
        </label>
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-slate-400 text-xs">
              🔍
            </span>
            <input
              id="college-search"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by college name..."
              disabled={isLoading}
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-8 pr-3 text-xs text-slate-900 placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 transition-colors"
          >
            Go
          </button>
        </form>
      </div>

      {/* 2. Location (State Filter) */}
      <div className="space-y-2">
        <label
          htmlFor="state-filter"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
        >
          State / Region
        </label>
        <select
          id="state-filter"
          value={filters.state}
          onChange={(e) =>
            onFilterChange({
              state: e.target.value === "All States" ? "" : e.target.value,
            })
          }
          disabled={isLoading}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        >
          {POPULAR_STATES.map((st) => (
            <option key={st} value={st === "All States" ? "" : st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* 3. Location (City Search) */}
      <div className="space-y-2">
        <label
          htmlFor="city-filter"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
        >
          City
        </label>
        <input
          id="city-filter"
          type="text"
          value={filters.city}
          onChange={(e) => onFilterChange({ city: e.target.value })}
          placeholder="e.g. Mumbai, Bengaluru..."
          disabled={isLoading}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
        />
      </div>

      {/* 4. Annual Tuition Fee Brackets */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Annual Tuition Fee
        </label>
        <div className="space-y-1.5">
          {FEE_PRESETS.map((preset) => (
            <label
              key={preset.id}
              className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              <input
                type="radio"
                name="feePreset"
                checked={filters.feePreset === preset.id}
                onChange={() => handleFeePresetChange(preset.id)}
                disabled={isLoading}
                className="text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
              />
              <span>{preset.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 5. Minimum Rating */}
      <div className="space-y-2">
        <label
          htmlFor="rating-filter"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
        >
          Minimum Rating
        </label>
        <select
          id="rating-filter"
          value={filters.minRating}
          onChange={(e) => onFilterChange({ minRating: e.target.value })}
          disabled={isLoading}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        >
          {RATING_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* 6. Ownership Type */}
      <div className="space-y-2">
        <label
          htmlFor="ownership-filter"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
        >
          Institution Type
        </label>
        <select
          id="ownership-filter"
          value={filters.ownership}
          onChange={(e) => onFilterChange({ ownership: e.target.value })}
          disabled={isLoading}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        >
          {OWNERSHIP_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
}
