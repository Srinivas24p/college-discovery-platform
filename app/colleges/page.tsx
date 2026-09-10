import { Suspense } from "react";
import CollegeListingClient from "@/components/colleges/CollegeListingClient";
import CollegeListSkeleton from "@/components/colleges/CollegeListSkeleton";

export const metadata = {
  title: "Explore Colleges & Cutoffs — CampusFind",
  description:
    "Discover, filter, and search premier engineering, management, and research institutions across India with real placement data, fee breakdowns, and student ratings.",
};

export default function CollegesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Explore Colleges & Universities
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Filter and compare top institutions across India backed by live verified placement, fee, and cutoff statistics.
        </p>
      </div>

      <Suspense fallback={<CollegeListSkeleton />}>
        <CollegeListingClient />
      </Suspense>
    </div>
  );
}
