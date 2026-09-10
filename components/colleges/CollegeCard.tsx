"use client";

import Link from "next/link";
import type { CollegeListItem } from "@/lib/services/collegeService";
import { useCompare } from "@/components/compare/CompareContext";
import { formatCurrency } from "@/lib/utils/format";

export { formatCurrency };

interface CollegeCardProps {
  college: CollegeListItem;
}

export default function CollegeCard({ college }: CollegeCardProps) {
  const {
    name,
    slug,
    location,
    ownership,
    rating,
    reviewCount,
    nirfRanking,
    naacGrade,
    fees,
    latestPlacement,
    coursesSummary,
    description,
  } = college;

  const ownershipColor =
    ownership === "PUBLIC"
      ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800"
      : ownership === "DEEMED"
      ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800"
      : ownership === "AUTONOMOUS"
      ? "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800"
      : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800";

  return (
    <div className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-900">
      <div className="space-y-4">
        {/* Header Badges & Rating */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${ownershipColor}`}
            >
              {ownership}
            </span>
            {nirfRanking && (
              <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                NIRF #{nirfRanking}
              </span>
            )}
            {naacGrade && (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300">
                NAAC {naacGrade}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 px-2 py-1 text-xs font-bold text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/50">
            <span className="text-amber-500">★</span>
            <span>{rating.toFixed(1)}</span>
            <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
              ({reviewCount})
            </span>
          </div>
        </div>

        {/* Title and Location */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-400 transition-colors">
            <Link href={`/colleges/${slug}`}>{name}</Link>
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>📍</span>
            <span>
              {location.city}, {location.state}
            </span>
          </p>
        </div>

        {/* Short Summary */}
        <p className="line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          {description}
        </p>

        {/* Metrics Grid (Fees & Placements) */}
        <div className="grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div>
            <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Annual Tuition Fees
            </span>
            <span className="mt-0.5 block text-sm font-bold text-slate-900 dark:text-slate-100">
              {fees.minAnnualFee === fees.maxAnnualFee
                ? `${formatCurrency(fees.minAnnualFee)}/yr`
                : `${formatCurrency(fees.minAnnualFee)} - ${formatCurrency(fees.maxAnnualFee)}/yr`}
            </span>
          </div>

          <div>
            <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Avg. Package (LPA)
            </span>
            <span className="mt-0.5 block text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {latestPlacement
                ? `₹${latestPlacement.averagePackageLPA.toFixed(1)} LPA`
                : "N/A"}
            </span>
          </div>
        </div>

        {/* Placement Highlight & Top Recruiters */}
        {latestPlacement && (
          <div className="space-y-1.5 pt-1 text-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span>Highest Package:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                ₹{latestPlacement.highestPackageLPA.toFixed(1)} LPA
              </span>
            </div>
            {latestPlacement.topRecruiters.length > 0 && (
              <div className="flex flex-wrap items-center gap-1 pt-1">
                <span className="text-[11px] text-slate-400">Recruiters:</span>
                {latestPlacement.topRecruiters.slice(0, 3).map((recruiter) => (
                  <span
                    key={recruiter}
                    className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-300"
                  >
                    {recruiter}
                  </span>
                ))}
                {latestPlacement.topRecruiters.length > 3 && (
                  <span className="text-[10px] text-slate-400">
                    +{latestPlacement.topRecruiters.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Courses Offered Preview */}
        {coursesSummary && coursesSummary.totalCount > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {coursesSummary.totalCount} Courses:
            </span>
            <span className="truncate max-w-[240px]">
              {coursesSummary.sampleCourses.join(", ")}
            </span>
          </div>
        )}
      </div>

      {/* Card Actions */}
      <div className="mt-5 flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
        <Link
          href={`/colleges/${slug}`}
          className="flex-1 rounded-lg bg-blue-700 px-3 py-2 text-center text-xs font-semibold text-white shadow-xs hover:bg-blue-800 transition-colors"
        >
          View Details
        </Link>
        <CompareButton slug={slug} />
      </div>
    </div>
  );
}

function CompareButton({ slug }: { slug: string }) {
  const { isComparing, addCollege, removeCollege } = useCompare();
  const comparing = isComparing(slug);

  return (
    <button
      type="button"
      onClick={() => {
        if (comparing) {
          removeCollege(slug);
        } else {
          addCollege(slug);
        }
      }}
      className={`rounded-lg px-3 py-2 text-center text-xs font-semibold transition-colors cursor-pointer ${
        comparing
          ? "bg-blue-50 border border-blue-300 text-blue-700 dark:bg-blue-950/60 dark:border-blue-700 dark:text-blue-300"
          : "border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
      }`}
      title={comparing ? "Remove from comparison" : "Add to comparison"}
    >
      {comparing ? "✓ Added" : "+ Compare"}
    </button>
  );
}
