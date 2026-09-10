"use client";

import type { PredictionResult, AdmissionProbability } from "@/lib/services/predictorService";

interface PredictorSummaryProps {
  result: PredictionResult;
  selectedTier: AdmissionProbability | "ALL";
  onSelectTier: (tier: AdmissionProbability | "ALL") => void;
}

export default function PredictorSummary({
  result,
  selectedTier,
  onSelectTier,
}: PredictorSummaryProps) {
  const { query, summary } = result;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
        <div className="space-y-0.5">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Prediction Results
          </span>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {query.exam} • Rank {query.rank.toLocaleString()} • {query.category}
            {query.quota ? ` • ${query.quota}` : ""}
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-500">
          Total Options Found: <span className="text-slate-900 dark:text-white font-bold">{summary.totalRecommendations}</span>
        </div>
      </div>

      {/* Filter Tabs by Probability Tier */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onSelectTier("ALL")}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
            selectedTier === "ALL"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              : "border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          }`}
        >
          All Recommendations ({summary.totalRecommendations})
        </button>

        <button
          type="button"
          onClick={() => onSelectTier("SAFE")}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
            selectedTier === "SAFE"
              ? "bg-emerald-600 text-white"
              : "border border-emerald-200 bg-emerald-50/50 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800/80 dark:bg-emerald-950/30 dark:text-emerald-300"
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Safe Choices ({summary.safeCount})
        </button>

        <button
          type="button"
          onClick={() => onSelectTier("TARGET")}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
            selectedTier === "TARGET"
              ? "bg-blue-600 text-white"
              : "border border-blue-200 bg-blue-50/50 text-blue-800 hover:bg-blue-100 dark:border-blue-800/80 dark:bg-blue-950/30 dark:text-blue-300"
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          Target Choices ({summary.targetCount})
        </button>

        <button
          type="button"
          onClick={() => onSelectTier("REACH")}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
            selectedTier === "REACH"
              ? "bg-amber-600 text-white"
              : "border border-amber-200 bg-amber-50/50 text-amber-800 hover:bg-amber-100 dark:border-amber-800/80 dark:bg-amber-950/30 dark:text-amber-300"
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          Reach / Spot Choices ({summary.reachCount})
        </button>
      </div>
    </div>
  );
}
