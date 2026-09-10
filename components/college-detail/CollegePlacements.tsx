import type { Placement } from "@/lib/generated/prisma/client";

interface CollegePlacementsProps {
  placements: Placement[];
}

export default function CollegePlacements({ placements }: CollegePlacementsProps) {
  if (placements.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Placement Statistics
        </h2>
        <p className="mt-2 text-xs text-slate-500">No placement records uploaded yet.</p>
      </div>
    );
  }

  return (
    <div id="placements" className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 scroll-mt-24">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Placement Statistics
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Audited package metrics, recruiter distribution, and placement percentages
        </p>
      </div>

      <div className="space-y-6">
        {placements.map((placement) => (
          <div
            key={placement.id}
            className="space-y-5 rounded-xl border border-slate-100 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-800/40"
          >
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 dark:border-slate-700/80">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                Academic Year {placement.academicYear}
              </span>
              {placement.placementPercentage && (
                <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {placement.placementPercentage}% Placed
                </span>
              )}
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-[11px] text-slate-500 uppercase tracking-wider">
                  Highest Package
                </span>
                <p className="mt-0.5 text-xl font-extrabold text-slate-900 dark:text-white">
                  ₹{placement.highestPackageLPA.toFixed(1)}
                  <span className="text-xs font-medium text-slate-400"> LPA</span>
                </p>
              </div>

              <div>
                <span className="text-[11px] text-slate-500 uppercase tracking-wider">
                  Average Package
                </span>
                <p className="mt-0.5 text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  ₹{placement.averagePackageLPA.toFixed(1)}
                  <span className="text-xs font-medium text-slate-400"> LPA</span>
                </p>
              </div>

              {placement.medianPackageLPA && (
                <div>
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider">
                    Median Package
                  </span>
                  <p className="mt-0.5 text-xl font-extrabold text-slate-900 dark:text-white">
                    ₹{placement.medianPackageLPA.toFixed(1)}
                    <span className="text-xs font-medium text-slate-400"> LPA</span>
                  </p>
                </div>
              )}

              {placement.totalOffers && (
                <div>
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider">
                    Total Offers
                  </span>
                  <p className="mt-0.5 text-xl font-extrabold text-slate-900 dark:text-white">
                    {placement.totalOffers}
                  </p>
                </div>
              )}
            </div>

            {/* Top Recruiters Cloud */}
            {placement.topRecruiters.length > 0 && (
              <div className="pt-2">
                <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Prominent Recruiters:
                </span>
                <div className="flex flex-wrap gap-2">
                  {placement.topRecruiters.map((recruiter) => (
                    <span
                      key={recruiter}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-2xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      {recruiter}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
