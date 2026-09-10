export default function CollegeListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="h-5 w-24 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-5 w-12 rounded bg-slate-200 dark:bg-slate-800" />
          </div>

          <div className="space-y-2">
            <div className="h-6 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
          </div>

          <div className="space-y-1.5">
            <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3">
            <div className="space-y-1">
              <div className="h-3 w-16 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-700" />
            </div>
            <div className="space-y-1">
              <div className="h-3 w-16 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <div className="h-8 flex-1 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-8 w-20 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
