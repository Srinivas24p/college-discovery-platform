"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import CollegeCard from "@/components/colleges/CollegeCard";
import CollegeFilters, { FilterState } from "@/components/colleges/CollegeFilters";
import CollegeSort from "@/components/colleges/CollegeSort";
import Pagination from "@/components/colleges/Pagination";
import CollegeListSkeleton from "@/components/colleges/CollegeListSkeleton";
import EmptyState from "@/components/colleges/EmptyState";
import ErrorState from "@/components/colleges/ErrorState";
import type { CollegeListItem } from "@/lib/services/collegeService";

const INITIAL_FILTERS: FilterState = {
  search: "",
  state: "",
  city: "",
  ownership: "",
  degree: "",
  minFee: "",
  maxFee: "",
  minRating: "",
  feePreset: "all",
};

export default function CollegeListingClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize filter state from current URL params
  const [filters, setFilters] = useState<FilterState>(() => ({
    search: searchParams.get("search") || searchParams.get("q") || "",
    state: searchParams.get("state") || "",
    city: searchParams.get("city") || "",
    ownership: searchParams.get("ownership") || "",
    degree: searchParams.get("degree") || "",
    minFee: searchParams.get("minFee") || "",
    maxFee: searchParams.get("maxFee") || "",
    minRating: searchParams.get("minRating") || "",
    feePreset: searchParams.get("feePreset") || "all",
  }));

  const [sortBy, setSortBy] = useState<string>(
    searchParams.get("sortBy") || "rating"
  );
  const [page, setPage] = useState<number>(() => {
    const p = parseInt(searchParams.get("page") || "1", 10);
    return isNaN(p) || p < 1 ? 1 : p;
  });

  const [colleges, setColleges] = useState<CollegeListItem[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Reference to abort in-flight requests if user changes filters rapidly
  const abortControllerRef = useRef<AbortController | null>(null);

  // Fetch colleges from API
  const fetchColleges = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    const query = new URLSearchParams();
    if (filters.search) query.set("search", filters.search);
    if (filters.state) query.set("state", filters.state);
    if (filters.city) query.set("city", filters.city);
    if (filters.ownership) query.set("ownership", filters.ownership);
    if (filters.degree) query.set("degree", filters.degree);
    if (filters.minFee) query.set("minFee", filters.minFee);
    if (filters.maxFee) query.set("maxFee", filters.maxFee);
    if (filters.minRating) query.set("minRating", filters.minRating);
    if (sortBy && sortBy !== "rating") query.set("sortBy", sortBy);
    if (page > 1) query.set("page", page.toString());

    // Update browser URL without triggering a full page navigation
    const queryString = query.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(newUrl, { scroll: false });

    try {
      const res = await fetch(`/api/colleges?${queryString}`, {
        signal: controller.signal,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to load colleges");
      }

      setColleges(data.data || []);
      setPagination(
        data.pagination || {
          page: 1,
          pageSize: 10,
          totalCount: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        }
      );
    } catch (err: unknown) {
      if ((err as { name?: string }).name !== "AbortError") {
        console.error("API error fetching colleges:", err);
        const msg = err instanceof Error ? err.message : "Failed to communicate with the server.";
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  }, [filters, sortBy, page, pathname, router]);

  // Trigger fetch whenever filter, sort, or page changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchColleges();
    }, 0);
    return () => {
      clearTimeout(timer);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchColleges]);

  // Handlers
  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1); // Always reset to page 1 on filter changes
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setSortBy("rating");
    setPage(1);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      {/* Mobile Filter Toggle */}
      <div className="flex items-center justify-between lg:hidden">
        <button
          type="button"
          onClick={() => setMobileFilterOpen((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <span>⚙️</span>
          <span>{mobileFilterOpen ? "Hide Filters" : "Show Filters"}</span>
        </button>
        <span className="text-xs text-slate-500">
          {pagination.totalCount} results
        </span>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Left Sidebar: Filters */}
        <div
          className={`${
            mobileFilterOpen ? "block" : "hidden"
          } lg:block lg:col-span-1`}
        >
          <div className="sticky top-20">
            <CollegeFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
              isLoading={isLoading}
              totalResults={pagination.totalCount}
            />
          </div>
        </div>

        {/* Right Main Content: Sort, Grid, Pagination */}
        <div className="space-y-6 lg:col-span-3">
          {/* Top of Results: Search, Result Count, Sort */}
          <CollegeSort
            sortBy={sortBy}
            onSortChange={handleSortChange}
            isLoading={isLoading}
            totalCount={pagination.totalCount}
            searchValue={filters.search}
            onSearchSubmit={(search) => handleFilterChange({ search })}
          />

          {/* Error State */}
          {error && <ErrorState message={error} onRetry={fetchColleges} />}

          {/* Loading State */}
          {isLoading && !error && <CollegeListSkeleton />}

          {/* Empty State */}
          {!isLoading && !error && colleges.length === 0 && (
            <EmptyState
              onReset={handleResetFilters}
              searchQuery={filters.search}
            />
          )}

          {/* Colleges Grid */}
          {!isLoading && !error && colleges.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {colleges.map((college) => (
                <CollegeCard key={college.id} college={college} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !error && (
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              hasNextPage={pagination.hasNextPage}
              hasPrevPage={pagination.hasPrevPage}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
