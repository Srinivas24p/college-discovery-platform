"use client";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50/50 p-12 text-center dark:border-red-900/50 dark:bg-red-950/20">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl dark:bg-red-900/50 mb-3 text-red-600 dark:text-red-400">
        ⚠️
      </div>
      <h3 className="text-base font-bold text-red-900 dark:text-red-200">
        Unable to load colleges
      </h3>
      <p className="mt-1 max-w-md text-xs text-red-700 dark:text-red-300/80">
        {message || "A network or server error occurred while retrieving data from the API."}
      </p>

      <div className="mt-5">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-red-500 transition-colors"
        >
          <span>↻</span>
          Try Again
        </button>
      </div>
    </div>
  );
}
