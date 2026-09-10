"use client";

import Link from "next/link";
import type { ComparisonCollegeItem } from "@/lib/services/collegeService";
import { formatCurrency } from "@/lib/utils/format";

interface ComparisonTableProps {
  colleges: ComparisonCollegeItem[];
  onRemove: (idOrSlug: string) => void;
  onAddAnother?: () => void;
}

export default function ComparisonTable({
  colleges,
  onRemove,
  onAddAnother,
}: ComparisonTableProps) {
  if (colleges.length === 0) {
    return null;
  }

  // Calculate best-in-class highlights
  const highestRating = Math.max(...colleges.map((c) => c.rating));
  const lowestMinFee = Math.min(...colleges.map((c) => c.minAnnualFee));
  const highestAvgPackage = Math.max(
    ...colleges.map((c) => c.placements[0]?.averagePackageLPA ?? 0)
  );
  const highestPeakPackage = Math.max(
    ...colleges.map((c) => c.placements[0]?.highestPackageLPA ?? 0)
  );

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <table className="w-full text-left border-collapse">
        {/* Table Header: College Identity Columns */}
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-800/40">
            <th className="p-4 sm:p-5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-48 min-w-[180px]">
              Feature / Metric
            </th>
            {colleges.map((college) => (
              <th
                key={college.id}
                className="p-4 sm:p-5 min-w-[240px] max-w-[320px] align-top relative border-l border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 uppercase">
                    {college.ownership}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemove(college.slug)}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-red-600 dark:hover:bg-slate-800 transition-colors"
                    title="Remove from comparison"
                  >
                    ✕
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  <Link
                    href={`/colleges/${college.slug}`}
                    className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                  >
                    {college.name}
                  </Link>
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  📍 {college.location.city}, {college.location.state}
                </p>
              </th>
            ))}

            {/* Empty Slot if < 3 colleges */}
            {colleges.length < 3 && onAddAnother && (
              <th className="p-4 sm:p-5 min-w-[200px] border-l border-dashed border-slate-200 dark:border-slate-800 align-middle text-center">
                <button
                  type="button"
                  onClick={onAddAnother}
                  className="inline-flex flex-col items-center gap-1.5 p-4 rounded-xl border border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50/50 dark:border-blue-800 dark:hover:bg-blue-950/30 transition-all text-blue-700 dark:text-blue-400"
                >
                  <span className="text-xl font-bold">+</span>
                  <span className="text-xs font-semibold">Add College</span>
                  <span className="text-[10px] text-slate-400">Up to 3</span>
                </button>
              </th>
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {/* Row: Location */}
          <tr className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20">
            <td className="p-4 font-semibold text-slate-500 dark:text-slate-400">
              Location
            </td>
            {colleges.map((c) => (
              <td key={c.id} className="p-4 border-l border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                {c.location.city}, {c.location.state}
              </td>
            ))}
            {colleges.length < 3 && <td className="border-l border-dashed border-slate-200 dark:border-slate-800" />}
          </tr>

          {/* Row: Rating */}
          <tr className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20">
            <td className="p-4 font-semibold text-slate-500 dark:text-slate-400">
              Student Rating
            </td>
            {colleges.map((c) => {
              const isBest = c.rating === highestRating && colleges.length > 1;
              return (
                <td key={c.id} className="p-4 border-l border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-500 font-bold">★ {c.rating.toFixed(1)}</span>
                    <span className="text-slate-400">({c.reviewCount})</span>
                    {isBest && (
                      <span className="rounded bg-emerald-50 px-1.5 py-0.2 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                        Top Rated
                      </span>
                    )}
                  </div>
                </td>
              );
            })}
            {colleges.length < 3 && <td className="border-l border-dashed border-slate-200 dark:border-slate-800" />}
          </tr>

          {/* Row: NIRF Ranking */}
          <tr className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20">
            <td className="p-4 font-semibold text-slate-500 dark:text-slate-400">
              NIRF Ranking
            </td>
            {colleges.map((c) => (
              <td key={c.id} className="p-4 border-l border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                {c.nirfRanking ? (
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    #{c.nirfRanking}
                  </span>
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </td>
            ))}
            {colleges.length < 3 && <td className="border-l border-dashed border-slate-200 dark:border-slate-800" />}
          </tr>

          {/* Row: NAAC Grade */}
          <tr className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20">
            <td className="p-4 font-semibold text-slate-500 dark:text-slate-400">
              NAAC Accreditation
            </td>
            {colleges.map((c) => (
              <td key={c.id} className="p-4 border-l border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                {c.naacGrade ? `Grade ${c.naacGrade}` : <span className="text-slate-400">—</span>}
              </td>
            ))}
            {colleges.length < 3 && <td className="border-l border-dashed border-slate-200 dark:border-slate-800" />}
          </tr>

          {/* Row: Annual Fees */}
          <tr className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20 bg-slate-50/20">
            <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
              Annual Tuition Fee
            </td>
            {colleges.map((c) => {
              const isBest = c.minAnnualFee === lowestMinFee && colleges.length > 1;
              return (
                <td key={c.id} className="p-4 border-l border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {c.minAnnualFee === c.maxAnnualFee
                      ? `${formatCurrency(c.minAnnualFee)}/yr`
                      : `${formatCurrency(c.minAnnualFee)} - ${formatCurrency(c.maxAnnualFee)}/yr`}
                  </span>
                  {isBest && (
                    <span className="ml-2 inline-block rounded bg-emerald-50 px-1.5 py-0.2 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                      Lowest Fee
                    </span>
                  )}
                </td>
              );
            })}
            {colleges.length < 3 && <td className="border-l border-dashed border-slate-200 dark:border-slate-800" />}
          </tr>

          {/* Row: Average Placement Package */}
          <tr className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20 bg-slate-50/20">
            <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
              Average Package (LPA)
            </td>
            {colleges.map((c) => {
              const latest = c.placements[0];
              const isBest =
                latest &&
                latest.averagePackageLPA === highestAvgPackage &&
                colleges.length > 1;

              return (
                <td key={c.id} className="p-4 border-l border-slate-100 dark:border-slate-800">
                  {latest ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                        ₹{latest.averagePackageLPA.toFixed(1)} LPA
                      </span>
                      {isBest && (
                        <span className="rounded bg-emerald-50 px-1.5 py-0.2 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                          Highest Avg
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-400">No data</span>
                  )}
                </td>
              );
            })}
            {colleges.length < 3 && <td className="border-l border-dashed border-slate-200 dark:border-slate-800" />}
          </tr>

          {/* Row: Highest Placement Package */}
          <tr className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20">
            <td className="p-4 font-semibold text-slate-500 dark:text-slate-400">
              Highest Package (LPA)
            </td>
            {colleges.map((c) => {
              const latest = c.placements[0];
              const isBest =
                latest &&
                latest.highestPackageLPA === highestPeakPackage &&
                colleges.length > 1;

              return (
                <td key={c.id} className="p-4 border-l border-slate-100 dark:border-slate-800">
                  {latest ? (
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">
                        ₹{latest.highestPackageLPA.toFixed(1)} LPA
                      </span>
                      {isBest && (
                        <span className="rounded bg-indigo-50 px-1.5 py-0.2 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                          Highest Offer
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-400">No data</span>
                  )}
                </td>
              );
            })}
            {colleges.length < 3 && <td className="border-l border-dashed border-slate-200 dark:border-slate-800" />}
          </tr>

          {/* Row: Placement Percentage */}
          <tr className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20">
            <td className="p-4 font-semibold text-slate-500 dark:text-slate-400">
              Placement Rate
            </td>
            {colleges.map((c) => {
              const latest = c.placements[0];
              return (
                <td key={c.id} className="p-4 border-l border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                  {latest?.placementPercentage ? `${latest.placementPercentage}%` : "—"}
                </td>
              );
            })}
            {colleges.length < 3 && <td className="border-l border-dashed border-slate-200 dark:border-slate-800" />}
          </tr>

          {/* Row: Top Recruiters */}
          <tr className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20">
            <td className="p-4 font-semibold text-slate-500 dark:text-slate-400">
              Key Recruiters
            </td>
            {colleges.map((c) => {
              const recruiters = c.placements[0]?.topRecruiters || [];
              return (
                <td key={c.id} className="p-4 border-l border-slate-100 dark:border-slate-800">
                  {recruiters.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {recruiters.slice(0, 4).map((r) => (
                        <span
                          key={r}
                          className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-700 dark:text-slate-300"
                        >
                          {r}
                        </span>
                      ))}
                      {recruiters.length > 4 && (
                        <span className="text-[10px] text-slate-400 self-center">
                          +{recruiters.length - 4}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
              );
            })}
            {colleges.length < 3 && <td className="border-l border-dashed border-slate-200 dark:border-slate-800" />}
          </tr>

          {/* Row: Courses Count */}
          <tr className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20">
            <td className="p-4 font-semibold text-slate-500 dark:text-slate-400">
              Programs Offered
            </td>
            {colleges.map((c) => (
              <td key={c.id} className="p-4 border-l border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                <span className="font-semibold">{c.courses.length}</span> programs
              </td>
            ))}
            {colleges.length < 3 && <td className="border-l border-dashed border-slate-200 dark:border-slate-800" />}
          </tr>

          {/* Row: Action Link */}
          <tr>
            <td className="p-4 font-semibold text-slate-500 dark:text-slate-400">
              Full Profile
            </td>
            {colleges.map((c) => (
              <td key={c.id} className="p-4 border-l border-slate-100 dark:border-slate-800">
                <Link
                  href={`/colleges/${c.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  View Details →
                </Link>
              </td>
            ))}
            {colleges.length < 3 && <td className="border-l border-dashed border-slate-200 dark:border-slate-800" />}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
