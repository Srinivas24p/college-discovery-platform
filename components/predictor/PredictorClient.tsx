"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import PredictorForm from "@/components/predictor/PredictorForm";
import PredictorSummary from "@/components/predictor/PredictorSummary";
import PredictorCard from "@/components/predictor/PredictorCard";
import PredictorAlgorithmExplainer from "@/components/predictor/PredictorAlgorithmExplainer";
import PredictorEmptyState from "@/components/predictor/PredictorEmptyState";
import ErrorState from "@/components/colleges/ErrorState";
import type {
  PredictionResult,
  AdmissionProbability,
} from "@/lib/services/predictorService";
import type { SupportedExam } from "@/lib/validations/predictor";

interface PredictorClientProps {
  initialResult?: PredictionResult | null;
}

export default function PredictorClient({
  initialResult = null,
}: PredictorClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [result, setResult] = useState<PredictionResult | null>(initialResult);
  const [selectedTier, setSelectedTier] = useState<AdmissionProbability | "ALL">("ALL");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Read initial params
  const initialExam = searchParams.get("exam") || "JEE Main";
  const initialRank = searchParams.get("rank")
    ? parseInt(searchParams.get("rank")!, 10)
    : 1500;
  const initialCategory = searchParams.get("category") || "General";

  const executePrediction = useCallback(
    async (params: {
      exam: SupportedExam;
      rank: number;
      category: string;
      quota?: string;
      maxFee?: number;
    }) => {
      setIsLoading(true);
      setError(null);

      // Update URL
      const query = new URLSearchParams();
      query.set("exam", params.exam);
      query.set("rank", params.rank.toString());
      if (params.category) query.set("category", params.category);
      if (params.quota) query.set("quota", params.quota);
      if (params.maxFee) query.set("maxFee", params.maxFee.toString());

      router.replace(`${pathname}?${query.toString()}`, { scroll: false });

      try {
        const res = await fetch(`/api/colleges/predict?${query.toString()}`);
        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(
            json.error?.message ||
              json.error?.details?.[0]?.message ||
              "Failed to calculate predictions."
          );
        }

        setResult(json.data);
        setSelectedTier("ALL");
      } catch (err: unknown) {
        console.error("Prediction fetch error:", err);
        const msg = err instanceof Error ? err.message : "Failed to communicate with prediction service.";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [pathname, router]
  );

  // If no initialResult but URL has exam and rank on mount, auto-fetch
  useEffect(() => {
    if (!initialResult && searchParams.get("exam") && searchParams.get("rank")) {
      const parsedRank = parseInt(searchParams.get("rank")!, 10);
      if (!isNaN(parsedRank) && parsedRank > 0) {
        const timer = setTimeout(() => {
          executePrediction({
            exam: searchParams.get("exam") as SupportedExam,
            rank: parsedRank,
            category: searchParams.get("category") || "General",
            quota: searchParams.get("quota") || undefined,
          });
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, [initialResult, searchParams, executePrediction]);

  // Filter recommendations based on selected tier tab
  const filteredRecommendations = result
    ? selectedTier === "ALL"
      ? result.recommendations
      : result.recommendations.filter((r) => r.probability === selectedTier)
    : [];

  return (
    <div className="space-y-8">
      {/* 1. Predictor Input Form */}
      <PredictorForm
        initialExam={initialExam}
        initialRank={initialRank}
        initialCategory={initialCategory}
        onSubmit={executePrediction}
        isLoading={isLoading}
      />

      {/* 2. Error State */}
      {error && (
        <ErrorState
          message={error}
          onRetry={() => {
            if (result) {
              executePrediction({
                exam: result.query.exam,
                rank: result.query.rank,
                category: result.query.category,
                quota: result.query.quota,
              });
            }
          }}
        />
      )}

      {/* 3. Loading State */}
      {isLoading && !error && (
        <div className="space-y-4 animate-pulse">
          <div className="h-20 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-64 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
            <div className="h-64 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
          </div>
        </div>
      )}

      {/* 4. Results Section */}
      {!isLoading && !error && result && (
        <div className="space-y-6">
          {/* Summary & Filter Chips */}
          <PredictorSummary
            result={result}
            selectedTier={selectedTier}
            onSelectTier={setSelectedTier}
          />

          {/* Empty Matching State */}
          {result.recommendations.length === 0 ? (
            <PredictorEmptyState
              exam={result.query.exam}
              rank={result.query.rank}
            />
          ) : filteredRecommendations.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900">
              No recommendations in the <strong>{selectedTier}</strong> tier for this rank. Try selecting another tab.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredRecommendations.map((option, idx) => (
                <PredictorCard
                  key={`${option.college.id}-${option.course.id}-${idx}`}
                  option={option}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. Algorithm & Methodology Documentation */}
      <PredictorAlgorithmExplainer />
    </div>
  );
}
