export default function PredictorAlgorithmExplainer() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 font-bold dark:bg-indigo-950/60 dark:text-indigo-400">
          📐
        </span>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Predictor Methodology & Mathematical Model
        </h3>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        The College Predictor operates on a <strong>100% deterministic mathematical evaluation model</strong>{" "}
        querying verified historical counseling cutoffs from PostgreSQL. It calculates the ratio between your
        achieved entrance rank and the historical closing rank of each academic program:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-3.5 dark:border-emerald-900/50 dark:bg-emerald-950/20 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
            <span>🟢</span>
            <span>Safe Choice (Rank ≤ 0.85 × Cutoff)</span>
          </div>
          <p className="text-emerald-900 dark:text-emerald-200/90 text-[11px] leading-relaxed">
            Your rank is at least 15% lower (better) than the past closing cutoff. High probability of securing a seat in initial counseling rounds.
          </p>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-3.5 dark:border-blue-900/50 dark:bg-blue-950/20 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-blue-800 dark:text-blue-300">
            <span>🔵</span>
            <span>Target Choice (0.85 &lt; Rank ≤ 1.05 × Cutoff)</span>
          </div>
          <p className="text-blue-900 dark:text-blue-200/90 text-[11px] leading-relaxed">
            Your rank is competitive and right around the cutoff margin (±5%). Strong candidate for regular seat allocation.
          </p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-3.5 dark:border-amber-900/50 dark:bg-amber-950/20 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
            <span>🟠</span>
            <span>Reach Choice (1.05 &lt; Rank ≤ 1.25 × Cutoff)</span>
          </div>
          <p className="text-amber-900 dark:text-amber-200/90 text-[11px] leading-relaxed">
            Your rank slightly exceeds previous cutoffs by up to 25%. Feasible during extended, upgrade, or institutional spot counseling rounds.
          </p>
        </div>
      </div>
    </div>
  );
}
