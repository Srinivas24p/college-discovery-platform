import Link from "next/link";
import type { PredictedCollegeOption } from "@/lib/services/predictorService";
import { formatCurrency } from "@/lib/utils/format";
import { useCompare } from "@/components/compare/CompareContext";

interface PredictorCardProps {
  option: PredictedCollegeOption;
}

export default function PredictorCard({ option }: PredictorCardProps) {
  const { college, course, cutoff, probability, probabilityPercent, rankDelta, explanation } =
    option;
  const { isComparing, addCollege, removeCollege } = useCompare();
  const comparing = isComparing(college.slug);

  const tierStyles =
    probability === "SAFE"
      ? {
          badge: "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
          border: "border-l-4 border-l-emerald-500",
          label: "Safe Choice",
          icon: "🟢",
        }
      : probability === "TARGET"
      ? {
          badge: "bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
          border: "border-l-4 border-l-blue-500",
          label: "Target Choice",
          icon: "🔵",
        }
      : {
          badge: "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
          border: "border-l-4 border-l-amber-500",
          label: "Reach / Dream Choice",
          icon: "🟠",
        };

  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4 ${tierStyles.border}`}
    >
      {/* Probability Badge and NIRF */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${tierStyles.badge}`}
        >
          <span>{tierStyles.icon}</span>
          <span>{tierStyles.label}</span>
          <span>• ~{probabilityPercent}% chance</span>
        </span>

        <div className="flex items-center gap-2 text-xs">
          {college.nirfRanking && (
            <span className="rounded bg-slate-100 px-2 py-0.5 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              NIRF #{college.nirfRanking}
            </span>
          )}
          <span className="rounded bg-amber-50 px-2 py-0.5 font-bold text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            ★ {college.rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* College and Course Headings */}
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white hover:text-blue-700 transition-colors">
          <Link href={`/colleges/${college.slug}`}>{college.name}</Link>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <span>📍</span>
          <span>
            {college.location.city}, {college.location.state}
          </span>
          <span>•</span>
          <span className="font-semibold text-blue-700 dark:text-blue-400">
            {course.name}
          </span>
        </p>
      </div>

      {/* Rank Comparison Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-lg bg-slate-50 p-3 text-xs dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">
            Closing Cutoff
          </span>
          <p className="font-bold text-slate-900 dark:text-white">
            Rank {cutoff.closingRank.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-400">
            {cutoff.examName} ({cutoff.academicYear})
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">
            Rank Margin
          </span>
          <p
            className={`font-bold ${
              rankDelta >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600"
            }`}
          >
            {rankDelta >= 0 ? `+${rankDelta.toLocaleString()} surplus` : `${rankDelta.toLocaleString()} deficit`}
          </p>
          <span className="text-[10px] text-slate-400">vs candidate rank</span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">
            Annual Fees
          </span>
          <p className="font-bold text-slate-900 dark:text-white">
            {formatCurrency(course.annualTuitionFee)}/yr
          </p>
          <span className="text-[10px] text-slate-400">{course.degree}</span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">
            Avg. Placement
          </span>
          <p className="font-bold text-emerald-600 dark:text-emerald-400">
            {college.latestPlacement
              ? `₹${college.latestPlacement.averagePackageLPA.toFixed(1)} LPA`
              : "N/A"}
          </p>
          <span className="text-[10px] text-slate-400">
            {college.latestPlacement?.academicYear || "Audited"}
          </span>
        </div>
      </div>

      {/* Transparent Why this was recommended box */}
      <div className="rounded-lg bg-blue-50/50 p-3 text-xs text-slate-700 dark:bg-blue-950/30 dark:text-slate-300 border border-blue-100 dark:border-blue-900/40">
        <span className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1 mb-0.5">
          <span>💡</span> Recommendation Rationale:
        </span>
        <p className="leading-relaxed text-[11px]">{explanation}</p>
      </div>

      {/* Action Footer */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
        <Link
          href={`/colleges/${college.slug}`}
          className="flex-1 rounded-lg bg-blue-700 px-3 py-2 text-center font-semibold text-white shadow-xs hover:bg-blue-800 transition-colors"
        >
          View College Details
        </Link>
        <button
          type="button"
          onClick={() => {
            if (comparing) {
              removeCollege(college.slug);
            } else {
              addCollege(college.slug);
            }
          }}
          className={`rounded-lg px-3 py-2 font-semibold transition-colors cursor-pointer ${
            comparing
              ? "bg-blue-50 border border-blue-300 text-blue-700 dark:bg-blue-950/60 dark:border-blue-700 dark:text-blue-300"
              : "border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          }`}
        >
          {comparing ? "✓ In Compare" : "+ Compare"}
        </button>
      </div>
    </div>
  );
}
