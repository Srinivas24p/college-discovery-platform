"use client";

import { useState } from "react";
import { SUPPORTED_EXAMS, SupportedExam } from "@/lib/validations/predictor";

interface PredictorFormProps {
  initialExam?: string;
  initialRank?: number;
  initialCategory?: string;
  onSubmit: (params: {
    exam: SupportedExam;
    rank: number;
    category: string;
    quota?: string;
    maxFee?: number;
  }) => void;
  isLoading: boolean;
}

const CATEGORIES = ["General", "OBC-NCL", "EWS", "SC", "ST"];
const QUOTAS = ["All Quotas", "All India", "Home State", "Other State"];

export default function PredictorForm({
  initialExam = "JEE Main",
  initialRank,
  initialCategory = "General",
  onSubmit,
  isLoading,
}: PredictorFormProps) {
  const [exam, setExam] = useState<SupportedExam>(
    initialExam && SUPPORTED_EXAMS.includes(initialExam as SupportedExam)
      ? (initialExam as SupportedExam)
      : "JEE Main"
  );
  const [rank, setRank] = useState<string>(
    initialRank ? initialRank.toString() : "1500"
  );
  const [category, setCategory] = useState<string>(initialCategory);
  const [quota, setQuota] = useState<string>("All Quotas");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const parsedRank = parseInt(rank, 10);
    if (isNaN(parsedRank) || parsedRank < 1) {
      setValidationError("Please enter a valid positive rank (e.g. 1500).");
      return;
    }

    onSubmit({
      exam,
      rank: parsedRank,
      category,
      quota: quota === "All Quotas" ? undefined : quota,
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 space-y-1 border-b border-slate-100 pb-4 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>🎯</span>
          <span>Admission Rank Predictor</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Enter your entrance examination details to calculate deterministic admission probabilities
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Exam Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="exam-select"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              Entrance Exam <span className="text-red-500">*</span>
            </label>
            <select
              id="exam-select"
              value={exam}
              onChange={(e) => setExam(e.target.value as SupportedExam)}
              disabled={isLoading}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {SUPPORTED_EXAMS.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Candidate Rank */}
          <div className="space-y-1.5">
            <label
              htmlFor="rank-input"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              Your Rank <span className="text-red-500">*</span>
            </label>
            <input
              id="rank-input"
              type="number"
              min="1"
              max="2000000"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              placeholder="e.g. 1500"
              disabled={isLoading}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* 3. Category */}
          <div className="space-y-1.5">
            <label
              htmlFor="category-select"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              Category
            </label>
            <select
              id="category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isLoading}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Quota (Optional) */}
          <div className="space-y-1.5">
            <label
              htmlFor="quota-select"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              Counseling Quota
            </label>
            <select
              id="quota-select"
              value={quota}
              onChange={(e) => setQuota(e.target.value)}
              disabled={isLoading}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {QUOTAS.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Validation error message */}
        {validationError && (
          <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
            ⚠️ {validationError}
          </p>
        )}

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>ℹ️</span>
            <span>Deterministic evaluation against JoSAA/counseling cutoffs</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 transition-colors"
          >
            {isLoading ? (
              <>
                <span className="animate-spin text-sm">↻</span>
                <span>Calculating Predictions...</span>
              </>
            ) : (
              <>
                <span>🚀</span>
                <span>Predict Colleges</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
