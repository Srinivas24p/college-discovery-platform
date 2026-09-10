import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 text-center">
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl dark:bg-slate-800">
          🏛️
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          College Not Found
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          The college profile you requested does not exist or may have been removed.
        </p>
        <div className="pt-4">
          <Link
            href="/colleges"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
          >
            <span>←</span>
            <span>Browse All Colleges</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
