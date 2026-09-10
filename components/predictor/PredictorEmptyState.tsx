interface PredictorEmptyStateProps {
  exam: string;
  rank: number;
}

export default function PredictorEmptyState({
  exam,
  rank,
}: PredictorEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900 space-y-3">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl dark:bg-slate-800">
        🎯
      </div>
      <h3 className="text-base font-bold text-slate-900 dark:text-white">
        No college cutoffs matched your criteria
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
        For <strong>{exam}</strong> at Rank <strong>{rank.toLocaleString()}</strong>, there are no historical cutoffs within the Reach margin (+25% cutoff band) for the selected category.
      </p>

      <div className="pt-2 text-xs text-slate-500">
        <p>Suggestions:</p>
        <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-400 text-[11px]">
          <li>Try selecting different counseling quotas (Home State vs Other State).</li>
          <li>Check other exams you have appeared for (e.g. COMEDK, VITEEE, KCET, BITSAT).</li>
          <li>Browse our full college directory for comprehensive options.</li>
        </ul>
      </div>
    </div>
  );
}
