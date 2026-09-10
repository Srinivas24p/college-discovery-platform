import { Suspense } from "react";
import PredictorClient from "@/components/predictor/PredictorClient";
import { predictColleges, PredictionResult } from "@/lib/services/predictorService";
import { validatePredictorParams } from "@/lib/validations/predictor";

interface PageProps {
  searchParams: Promise<{
    exam?: string;
    rank?: string;
    category?: string;
    quota?: string;
    maxFee?: string;
  }>;
}

export const metadata = {
  title: "Find Colleges You May Get Into — CampusFind",
  description:
    "Predict your admission chances for top engineering and technology colleges across India using competitive entrance exam ranks and deterministic counseling cutoff data.",
};

export default async function PredictorPage({ searchParams }: PageProps) {
  const params = await searchParams;
  let initialResult: PredictionResult | null = null;

  if (params.exam && params.rank) {
    const validation = validatePredictorParams(
      params.exam,
      params.rank,
      params.category,
      params.quota,
      params.maxFee
    );

    if (validation.isValid && validation.data) {
      try {
        initialResult = await predictColleges(validation.data);
      } catch (err) {
        console.error("Initial SSR prediction failed:", err);
      }
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Find Colleges You May Get Into
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Enter your entrance exam rank to calculate deterministic admission probabilities across Safe, Target, and Reach colleges based on official cutoffs.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="h-96 rounded-2xl border border-slate-200 bg-white p-8 animate-pulse dark:border-slate-800 dark:bg-slate-900" />
        }
      >
        <PredictorClient initialResult={initialResult} />
      </Suspense>
    </div>
  );
}
