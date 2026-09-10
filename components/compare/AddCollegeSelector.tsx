"use client";

import { useState, useEffect } from "react";
import type { CollegeListItem } from "@/lib/services/collegeService";

interface AddCollegeSelectorProps {
  currentIds: string[];
  onSelect: (slug: string) => void;
  onClose: () => void;
}

export default function AddCollegeSelector({
  currentIds,
  onSelect,
  onClose,
}: AddCollegeSelectorProps) {
  const [colleges, setColleges] = useState<CollegeListItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadColleges() {
      try {
        const res = await fetch("/api/colleges?pageSize=50");
        const json = await res.json();
        const collegeList = Array.isArray(json.data?.colleges)
          ? json.data.colleges
          : Array.isArray(json.data)
          ? json.data
          : [];
        setColleges(collegeList);
      } catch (err) {
        console.error("Failed to load colleges for selector", err);
      } finally {
        setLoading(false);
      }
    }
    loadColleges();
  }, []);

  const available = colleges.filter(
    (c) =>
      !currentIds.includes(c.id) &&
      !currentIds.includes(c.slug) &&
      c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Add College to Compare
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-bold"
          >
            ✕
          </button>
        </div>

        <div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by college name..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            autoFocus
          />
        </div>

        <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Loading available colleges...
            </div>
          ) : available.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              {search
                ? "No matching colleges found."
                : "All colleges are already selected."}
            </div>
          ) : (
            available.map((college) => (
              <button
                key={college.id}
                type="button"
                onClick={() => {
                  onSelect(college.slug);
                  onClose();
                }}
                className="w-full p-3 text-left hover:bg-blue-50/50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between gap-3 group cursor-pointer"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400">
                    {college.name}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    📍 {college.location.city}, {college.location.state} • ★ {college.rating.toFixed(1)}
                  </p>
                </div>
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                  + Add
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
