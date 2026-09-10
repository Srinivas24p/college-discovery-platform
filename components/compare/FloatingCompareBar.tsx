"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCompare } from "@/components/compare/CompareContext";

export default function FloatingCompareBar() {
  const { compareIds, removeCollege, clearCompare } = useCompare();
  const pathname = usePathname();

  // Hide the floating bar on the /compare page itself
  if (compareIds.length === 0 || pathname === "/compare") {
    return null;
  }

  return (
    <div className="fixed bottom-5 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-200 bg-white/95 backdrop-blur-md px-5 py-3 shadow-xl dark:border-blue-900/60 dark:bg-slate-900/95 max-w-2xl w-full">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-700 text-xs font-bold text-white shadow-xs">
            ⚖️
          </span>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Comparing {compareIds.length} of 3 colleges
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              {compareIds.length < 2
                ? "Select at least 1 more to compare"
                : "Ready to compare side-by-side"}
            </span>
          </div>
        </div>

        {/* Selected College Chips */}
        <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto max-w-[280px]">
          {compareIds.map((id) => (
            <span
              key={id}
              className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              <span className="truncate max-w-[80px]">{id}</span>
              <button
                type="button"
                onClick={() => removeCollege(id)}
                className="text-slate-400 hover:text-red-500 font-bold ml-0.5"
                title="Remove"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clearCompare}
            className="text-[11px] font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            Clear
          </button>
          <Link
            href={`/compare?ids=${compareIds.join(",")}`}
            className="rounded-lg bg-blue-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-800 transition-colors"
          >
            Compare Now →
          </Link>
        </div>
      </div>
    </div>
  );
}
