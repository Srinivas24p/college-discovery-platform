export default function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-8 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="grid grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="h-10 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-10 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-10 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-10 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      {/* Overview Skeleton */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="h-6 w-40 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="grid grid-cols-4 gap-4 pt-4">
          <div className="h-16 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-16 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-16 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-16 rounded-xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      {/* Courses Skeleton */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="h-6 w-48 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-12 w-full rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-12 w-full rounded bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
}
