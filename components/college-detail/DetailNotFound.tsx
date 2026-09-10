import Link from "next/link";

interface DetailNotFoundProps {
  identifier: string;
}

export default function DetailNotFound({ identifier }: DetailNotFoundProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 text-center">
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl dark:bg-slate-800">
          🏛️
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          College Not Found
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          We couldn&apos;t find an institution with identifier &ldquo;{identifier}&rdquo;.
          The college might have been moved, renamed, or does not exist in the database.
        </p>

        <div className="pt-4 flex items-center justify-center gap-3">
          <Link
            href="/colleges"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
          >
            <span>←</span>
            <span>Back to All Colleges</span>
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
