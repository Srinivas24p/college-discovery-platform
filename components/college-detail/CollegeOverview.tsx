import type { CollegeDetailData } from "@/lib/services/collegeService";
import { formatCurrency } from "@/lib/utils/format";

interface CollegeOverviewProps {
  college: CollegeDetailData;
}

export default function CollegeOverview({ college }: CollegeOverviewProps) {
  const {
    description,
    overview,
    minAnnualFee,
    maxAnnualFee,
    courses,
    placements,
  } = college;

  const latestPlacement = placements[0] ?? null;

  return (
    <div id="overview" className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 scroll-mt-24">
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          About & Overview
        </h2>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {description}
        </p>
        {overview && (
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pt-2">
            {overview}
          </p>
        )}
      </div>

      {/* Key Highlights Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Annual Fees
          </span>
          <p className="mt-1 text-base font-extrabold text-slate-900 dark:text-white">
            {minAnnualFee === maxAnnualFee
              ? formatCurrency(minAnnualFee)
              : `${formatCurrency(minAnnualFee)} - ${formatCurrency(maxAnnualFee)}`}
          </p>
          <span className="text-[10px] text-slate-400">per academic year</span>
        </div>

        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Avg. Placement
          </span>
          <p className="mt-1 text-base font-extrabold text-emerald-600 dark:text-emerald-400">
            {latestPlacement
              ? `₹${latestPlacement.averagePackageLPA.toFixed(1)} LPA`
              : "N/A"}
          </p>
          <span className="text-[10px] text-slate-400">
            {latestPlacement ? latestPlacement.academicYear : "No records"}
          </span>
        </div>

        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Highest Package
          </span>
          <p className="mt-1 text-base font-extrabold text-indigo-600 dark:text-indigo-400">
            {latestPlacement
              ? `₹${latestPlacement.highestPackageLPA.toFixed(1)} LPA`
              : "N/A"}
          </p>
          <span className="text-[10px] text-slate-400">top recorded offer</span>
        </div>

        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Courses Offered
          </span>
          <p className="mt-1 text-base font-extrabold text-slate-900 dark:text-white">
            {courses.length}
          </p>
          <span className="text-[10px] text-slate-400">Undergrad & Postgrad</span>
        </div>
      </div>
    </div>
  );
}
