import Link from "next/link";
import type { Cutoff } from "@/lib/generated/prisma/client";

interface CollegeCutoffsProps {
  cutoffs: Cutoff[];
}

export default function CollegeCutoffs({ cutoffs }: CollegeCutoffsProps) {
  if (cutoffs.length === 0) {
    return null;
  }

  return (
    <div id="cutoffs" className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Admission Cutoffs & Ranks
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Historical entrance exam closing ranks across counseling rounds and quotas
          </p>
        </div>

        <Link
          href="/predictor"
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 transition-colors"
        >
          <span>🎯</span>
          <span>Open Rank Predictor</span>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
              <th className="py-2.5 px-3 font-semibold">Exam</th>
              <th className="py-2.5 px-3 font-semibold">Year</th>
              <th className="py-2.5 px-3 font-semibold">Round</th>
              <th className="py-2.5 px-3 font-semibold">Category</th>
              <th className="py-2.5 px-3 font-semibold">Quota</th>
              <th className="py-2.5 px-3 font-semibold text-right">Opening Rank</th>
              <th className="py-2.5 px-3 font-semibold text-right">Closing Rank</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {cutoffs.map((cutoff) => (
              <tr key={cutoff.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="py-2.5 px-3 font-bold text-indigo-600 dark:text-indigo-400">
                  {cutoff.examName}
                </td>
                <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                  {cutoff.academicYear}
                </td>
                <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                  Round {cutoff.round}
                </td>
                <td className="py-2.5 px-3">
                  <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 font-medium text-slate-700 dark:text-slate-300">
                    {cutoff.category}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                  {cutoff.quota}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-700 dark:text-slate-300">
                  {cutoff.openingRank.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                  {cutoff.closingRank.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
