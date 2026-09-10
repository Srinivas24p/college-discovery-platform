"use client";

import Link from "next/link";
import type { CollegeDetailData } from "@/lib/services/collegeService";
import { formatCurrency } from "@/lib/utils/format";
import { useCompare } from "@/components/compare/CompareContext";

interface CollegeHeaderProps {
  college: CollegeDetailData;
}

export default function CollegeHeader({ college }: CollegeHeaderProps) {
  const { isComparing, addCollege, removeCollege } = useCompare();

  const {
    name,
    ownership,
    location,
    tagline,
    naacGrade,
    rating,
    reviewCount,
    minAnnualFee,
    maxAnnualFee,
    establishedYear,
    campusSizeAcres,
    website,
    email,
    phone,
    slug,
    placements,
  } = college;

  const comparing = isComparing(slug);
  const latestPlacement = placements[0] ?? null;

  const ownershipColor =
    ownership === "PUBLIC"
      ? "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800"
      : ownership === "DEEMED"
      ? "bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800"
      : ownership === "AUTONOMOUS"
      ? "bg-teal-50 text-teal-800 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800"
      : "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/colleges" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
          Colleges
        </Link>
        <span>/</span>
        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[240px] sm:max-w-none">
          {name}
        </span>
      </nav>

      {/* Primary Info Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full border px-3 py-0.5 text-xs font-semibold uppercase tracking-wider ${ownershipColor}`}
            >
              {ownership} Institute
            </span>
            {college.nirfRanking && (
              <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-0.5 text-xs font-semibold text-blue-800 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300">
                NIRF #{college.nirfRanking}
              </span>
            )}
            {naacGrade && (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-0.5 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                NAAC {naacGrade}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            {name}
          </h1>

          {tagline && (
            <p className="text-sm italic text-slate-500 dark:text-slate-400">
              &ldquo;{tagline}&rdquo;
            </p>
          )}

          <p className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
            <span>📍</span>
            <span>
              {location.city}, {location.state}, {location.country}
            </span>
          </p>
        </div>

        {/* Header Action: Add to Compare */}
        <div className="flex flex-wrap items-center lg:flex-col lg:items-end gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              if (comparing) {
                removeCollege(slug);
              } else {
                addCollege(slug);
              }
            }}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold shadow-xs transition-colors cursor-pointer ${
              comparing
                ? "bg-blue-50 border border-blue-400 text-blue-800 dark:bg-blue-950/60 dark:border-blue-700 dark:text-blue-300"
                : "bg-blue-700 text-white hover:bg-blue-800 shadow-xs"
            }`}
          >
            <span>{comparing ? "✓ Added to Comparison" : "+ Add to Compare"}</span>
          </button>

          {comparing && (
            <Link
              href="/compare"
              className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline"
            >
              View Comparison Matrix →
            </Link>
          )}
        </div>
      </div>

      {/* 4 Summary Highlight Cards: Fees, Rating, Placements, Location */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* 1. Tuition Fees */}
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Annual Tuition
          </span>
          <p className="mt-1 text-base font-extrabold text-slate-900 dark:text-white">
            {minAnnualFee === maxAnnualFee
              ? `${formatCurrency(minAnnualFee)}/yr`
              : `${formatCurrency(minAnnualFee)} - ${formatCurrency(maxAnnualFee)}/yr`}
          </p>
          <span className="text-[11px] text-slate-400">per academic year</span>
        </div>

        {/* 2. Rating */}
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Student Rating
          </span>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="text-amber-500 font-bold text-base">★</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white">
              {rating.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400">({reviewCount} reviews)</span>
          </div>
          <span className="text-[11px] text-slate-400">verified reviews</span>
        </div>

        {/* 3. Placement Info */}
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Average Package
          </span>
          <p className="mt-1 text-base font-extrabold text-emerald-600 dark:text-emerald-400">
            {latestPlacement
              ? `₹${latestPlacement.averagePackageLPA.toFixed(1)} LPA`
              : "N/A"}
          </p>
          <span className="text-[11px] text-slate-400">
            {latestPlacement ? `Highest: ₹${latestPlacement.highestPackageLPA} LPA` : "Latest cohort"}
          </span>
        </div>

        {/* 4. Location & Campus */}
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Campus Location
          </span>
          <p className="mt-1 text-base font-extrabold text-slate-900 dark:text-white truncate">
            {location.city}, {location.state}
          </p>
          <span className="text-[11px] text-slate-400">
            {campusSizeAcres ? `${campusSizeAcres} Acres Campus` : "Premier Campus"}
          </span>
        </div>
      </div>

      {/* Contact & Portal Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
        {establishedYear && (
          <div className="space-y-0.5">
            <span className="text-slate-400">Established</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              {establishedYear}
            </p>
          </div>
        )}

        {phone && (
          <div className="space-y-0.5">
            <span className="text-slate-400">Admissions Desk</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
              {phone}
            </p>
          </div>
        )}

        {email && (
          <div className="space-y-0.5">
            <span className="text-slate-400">Email Contact</span>
            <a
              href={`mailto:${email}`}
              className="font-semibold text-slate-800 dark:text-slate-200 block truncate hover:underline"
            >
              {email}
            </a>
          </div>
        )}

        {website && (
          <div className="space-y-0.5">
            <span className="text-slate-400">Official Portal</span>
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue-700 hover:underline dark:text-blue-400 block truncate"
            >
              {website.replace(/^https?:\/\//, "")} ↗
            </a>
          </div>
        )}
      </div>

      {/* Section Jump Bar */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
        <span className="font-semibold text-slate-500 mr-1">Jump to:</span>
        <a
          href="#overview"
          className="rounded-md bg-slate-100 px-3 py-1 font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
        >
          Overview
        </a>
        <a
          href="#courses"
          className="rounded-md bg-slate-100 px-3 py-1 font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
        >
          Courses & Fees
        </a>
        <a
          href="#placements"
          className="rounded-md bg-slate-100 px-3 py-1 font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
        >
          Placements
        </a>
        <a
          href="#cutoffs"
          className="rounded-md bg-slate-100 px-3 py-1 font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
        >
          Cutoffs
        </a>
        <a
          href="#reviews"
          className="rounded-md bg-slate-100 px-3 py-1 font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
        >
          Student Reviews
        </a>
      </div>
    </div>
  );
}
