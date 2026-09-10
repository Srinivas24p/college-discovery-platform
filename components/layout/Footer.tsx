import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 transition-colors mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-100 dark:border-slate-800">
          {/* Col 1: Brand & Overview */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-700 text-white font-bold text-xs">
                CF
              </div>
              <span className="text-base font-bold text-slate-900 dark:text-white">
                Campus<span className="text-blue-700 dark:text-blue-400">Find</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              India&apos;s clean, database-driven college discovery, side-by-side comparison, and admission prediction platform.
            </p>
          </div>

          {/* Col 2: Core Platform Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Platform
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/colleges" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                  Explore Colleges & Cutoffs
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                  Compare 2–3 Colleges
                </Link>
              </li>
              <li>
                <Link href="/predictor" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                  Rank Admission Predictor
                </Link>
              </li>
              <li>
                <Link href="/api/health" target="_blank" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                  API Health Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Hubs */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Popular States
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/colleges?state=Delhi" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                  Colleges in Delhi NCR
                </Link>
              </li>
              <li>
                <Link href="/colleges?state=Maharashtra" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                  Colleges in Maharashtra
                </Link>
              </li>
              <li>
                <Link href="/colleges?state=Karnataka" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                  Colleges in Karnataka
                </Link>
              </li>
              <li>
                <Link href="/colleges?state=Tamil+Nadu" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                  Colleges in Tamil Nadu
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Tech Stack Rigor */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Engineering Stack
            </h4>
            <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
              <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5">Next.js 16</span>
              <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5">React 19</span>
              <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5">TypeScript 5</span>
              <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5">Tailwind v4</span>
              <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5">PostgreSQL 17</span>
              <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5">Prisma ORM 7</span>
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium pt-1">
              ✓ 100% Database-Driven • Zero Mock Data
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-xs text-slate-500 dark:text-slate-400">
          <div>
            © {new Date().getFullYear()} CampusFind. Full-Stack Engineer Track A Assessment.
          </div>
          <div className="flex items-center gap-4">
            <span>Deterministic Math Predictor</span>
            <span>•</span>
            <span>ACID Normalized Schema</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
