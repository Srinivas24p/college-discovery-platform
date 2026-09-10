"use client";

interface EmptyStateProps {
  onReset: () => void;
  searchQuery?: string;
}

export default function EmptyState({ onReset, searchQuery }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl dark:bg-slate-800 mb-4">
        🔍
      </div>
      <h3 className="text-base font-bold text-slate-900 dark:text-white">
        No matching colleges found
      </h3>
      <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
        {searchQuery
          ? `We couldn't find any institutions matching "${searchQuery}". Try broadening your search or adjusting the filters.`
          : "None of the colleges currently meet the selected combination of location, fees, and rating criteria."}
      </p>

      <div className="mt-6">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
        >
          <span>↺</span>
          Reset All Filters
        </button>
      </div>
    </div>
  );
}
