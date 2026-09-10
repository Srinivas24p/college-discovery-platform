"use client";

interface PaginationProps {
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (newPage: number) => void;
  isLoading: boolean;
}

export default function Pagination({
  page,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onPageChange,
  isLoading,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  // Generate page numbers array with intelligent ellipsis if many pages
  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <nav
      aria-label="Pagination Navigation"
      className="flex items-center justify-between border-t border-slate-200 bg-transparent px-4 py-6 sm:px-0 dark:border-slate-800"
    >
      {/* Previous Button */}
      <div className="-mt-px flex w-0 flex-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage || isLoading}
          className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-xs font-semibold text-slate-500 hover:border-slate-300 hover:text-slate-700 disabled:pointer-events-none disabled:opacity-30 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200 transition-colors"
        >
          <span className="mr-2">←</span>
          Previous
        </button>
      </div>

      {/* Page Numbers */}
      <div className="hidden md:-mt-px md:flex gap-1">
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            disabled={isLoading || p === page}
            className={`inline-flex items-center border-t-2 px-3 pt-4 text-xs font-semibold transition-colors ${
              p === page
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <div className="-mt-px flex w-0 flex-1 justify-end">
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage || isLoading}
          className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-xs font-semibold text-slate-500 hover:border-slate-300 hover:text-slate-700 disabled:pointer-events-none disabled:opacity-30 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200 transition-colors"
        >
          Next
          <span className="ml-2">→</span>
        </button>
      </div>
    </nav>
  );
}
