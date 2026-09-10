import Link from "next/link";

interface EmptyCompareProps {
  onQuickCompare: (slugs: string[]) => void;
}

const PRESET_COMPARISONS = [
  {
    title: "IIT Bombay vs IIT Delhi",
    subtitle: "Premier National Institutes of Technology",
    slugs: ["iit-bombay", "iit-delhi"],
    tag: "Top Tier IITs",
  },
  {
    title: "BITS Pilani vs IIIT Hyderabad",
    subtitle: "Deemed Private vs Autonomous Research Excellence",
    slugs: ["bits-pilani", "iiit-hyderabad"],
    tag: "Tech Giants",
  },
  {
    title: "NIT Trichy vs DTU Delhi",
    subtitle: "Top National Institute vs Delhi State University",
    slugs: ["nit-trichy", "dtu-delhi"],
    tag: "Best Value ROI",
  },
  {
    title: "IIT Bombay vs BITS Pilani vs RVCE",
    subtitle: "Public Institute vs Deemed vs Autonomous Metro",
    slugs: ["iit-bombay", "bits-pilani", "rvce-bengaluru"],
    tag: "3-Way Comparison",
  },
];

export default function EmptyCompare({ onQuickCompare }: EmptyCompareProps) {
  return (
    <div className="space-y-10 rounded-2xl border border-dashed border-slate-300 bg-white p-8 sm:p-12 text-center dark:border-slate-800 dark:bg-slate-900">
      <div className="space-y-3 max-w-lg mx-auto">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-3xl dark:bg-indigo-950/60 shadow-inner">
          ⚖️
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Compare Colleges Side-by-Side
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Select between 2 and 3 colleges to compare tuition fees, placement packages,
          accreditations, and student reviews.
        </p>

        <div className="pt-2">
          <Link
            href="/colleges"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
          >
            <span>🔍</span>
            <span>Browse Colleges & Add to Compare</span>
          </Link>
        </div>
      </div>

      {/* Quick Launch Pre-set Comparisons */}
      <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800 text-left">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 text-center">
          Or Launch Popular Comparisons Instantly:
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {PRESET_COMPARISONS.map((preset) => (
            <button
              key={preset.title}
              type="button"
              onClick={() => onQuickCompare(preset.slugs)}
              className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-left shadow-2xs hover:border-indigo-400 hover:bg-white dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-indigo-700 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {preset.tag}
                  </span>
                  <span className="text-xs text-slate-400 group-hover:text-indigo-600 transition-colors">
                    Compare →
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                  {preset.title}
                </h4>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                  {preset.subtitle}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
