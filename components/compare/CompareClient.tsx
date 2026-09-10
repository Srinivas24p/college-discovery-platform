"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCompare } from "@/components/compare/CompareContext";
import ComparisonTable from "@/components/compare/ComparisonTable";
import EmptyCompare from "@/components/compare/EmptyCompare";
import AddCollegeSelector from "@/components/compare/AddCollegeSelector";
import ErrorState from "@/components/colleges/ErrorState";
import type { ComparisonCollegeItem } from "@/lib/services/collegeService";

interface CompareClientProps {
  initialColleges?: ComparisonCollegeItem[];
}

export default function CompareClient({
  initialColleges = [],
}: CompareClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { compareIds, addCollege, removeCollege, clearCompare } = useCompare();

  const [colleges, setColleges] = useState<ComparisonCollegeItem[]>(initialColleges);
  const [isLoading, setIsLoading] = useState<boolean>(initialColleges.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [selectorOpen, setSelectorOpen] = useState<boolean>(false);

  // Read initial IDs from URL params or fallback to Context state
  useEffect(() => {
    const urlIds = [
      ...(searchParams.get("ids")?.split(",") || []),
      searchParams.get("college1"),
      searchParams.get("college2"),
      searchParams.get("college3"),
    ].filter((id): id is string => Boolean(id && id.trim().length > 0));

    if (urlIds.length > 0) {
      for (const id of urlIds) {
        addCollege(id);
      }
    }
  }, [searchParams, addCollege]);

  // Fetch comparison data from backend API
  const fetchComparison = useCallback(async () => {
    if (compareIds.length === 0) {
      setColleges([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Sync URL with currently compared IDs
    const newQuery = new URLSearchParams();
    newQuery.set("ids", compareIds.join(","));
    router.replace(`${pathname}?${newQuery.toString()}`, { scroll: false });

    try {
      const res = await fetch(`/api/colleges/compare?ids=${compareIds.join(",")}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to load comparison data.");
      }

      setColleges(json.data || []);
    } catch (err: unknown) {
      console.error("Comparison fetch error:", err);
      const msg = err instanceof Error ? err.message : "Failed to communicate with comparison service.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [compareIds, pathname, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchComparison();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchComparison]);

  const handleQuickCompare = (slugs: string[]) => {
    clearCompare();
    for (const slug of slugs) {
      addCollege(slug);
    }
  };

  const handleAddAnother = () => {
    setSelectorOpen(true);
  };

  const handleSelectFromModal = (slug: string) => {
    addCollege(slug);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar when comparing colleges */}
      {compareIds.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">
              ⚖️
            </span>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Comparing {colleges.length} of 3 Institutions
            </span>
            {colleges.length < 2 && (
              <span className="text-[11px] text-amber-600 dark:text-amber-400">
                (Add at least 1 more for a head-to-head comparison)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {colleges.length < 3 && (
              <button
                type="button"
                onClick={handleAddAnother}
                className="rounded-lg border border-indigo-300 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 transition-colors"
              >
                + Add Another
              </button>
            )}
            <button
              type="button"
              onClick={clearCompare}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && <ErrorState message={error} onRetry={fetchComparison} />}

      {/* Loading Skeleton */}
      {isLoading && !error && (
        <div className="h-96 rounded-2xl border border-slate-200 bg-white p-8 animate-pulse dark:border-slate-800 dark:bg-slate-900" />
      )}

      {/* Empty State */}
      {!isLoading && !error && compareIds.length === 0 && (
        <EmptyCompare onQuickCompare={handleQuickCompare} />
      )}

      {/* Comparison Table */}
      {!isLoading && !error && colleges.length > 0 && (
        <ComparisonTable
          colleges={colleges}
          onRemove={removeCollege}
          onAddAnother={handleAddAnother}
        />
      )}

      {/* Add College Modal */}
      {selectorOpen && (
        <AddCollegeSelector
          currentIds={compareIds}
          onSelect={handleSelectFromModal}
          onClose={() => setSelectorOpen(false)}
        />
      )}
    </div>
  );
}
