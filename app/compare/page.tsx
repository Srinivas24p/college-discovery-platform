import { Suspense } from "react";
import CompareClient from "@/components/compare/CompareClient";
import { getCollegesForComparison } from "@/lib/services/collegeService";

interface PageProps {
  searchParams: Promise<{
    ids?: string;
    college1?: string;
    college2?: string;
    college3?: string;
  }>;
}

export const metadata = {
  title: "Compare Colleges Side-by-Side — CampusFind",
  description:
    "Compare 2–3 colleges side-by-side on tuition fees, placement averages, highest packages, NIRF rankings, and verified student ratings.",
};

export default async function ComparePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const rawIds = [
    ...(params.ids?.split(",") || []),
    params.college1,
    params.college2,
    params.college3,
  ].filter((id): id is string => Boolean(id && id.trim().length > 0));

  const initialColleges = await getCollegesForComparison(rawIds);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Compare Colleges
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Analyze head-to-head metric differences between 2–3 selected institutions.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="h-96 rounded-2xl border border-slate-200 bg-white p-8 animate-pulse dark:border-slate-800 dark:bg-slate-900" />
        }
      >
        <CompareClient initialColleges={initialColleges} />
      </Suspense>
    </div>
  );
}
