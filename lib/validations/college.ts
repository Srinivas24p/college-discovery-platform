import { CollegeOwnership, DegreeLevel } from "@/lib/generated/prisma/client";

export interface CollegeSearchParams {
  search?: string;
  state?: string;
  city?: string;
  ownership?: CollegeOwnership;
  degree?: DegreeLevel;
  minFee?: number;
  maxFee?: number;
  minRating?: number;
  sortBy: "rating" | "fee_asc" | "fee_desc" | "nirf" | "name" | "newest";
  page: number;
  pageSize: number;
}

export interface ValidationErrorDetail {
  field: string;
  message: string;
}

export interface ValidationResult<T> {
  isValid: boolean;
  data?: T;
  errors?: ValidationErrorDetail[];
}

const VALID_SORT_OPTIONS = [
  "rating",
  "fee_asc",
  "fee_desc",
  "nirf",
  "name",
  "newest",
] as const;

export function validateAndParseCollegeQueryParams(
  searchParams: URLSearchParams
): ValidationResult<CollegeSearchParams> {
  const errors: ValidationErrorDetail[] = [];

  // Search keyword
  let search: string | undefined = undefined;
  const rawSearch = searchParams.get("search") || searchParams.get("q");
  if (rawSearch !== null && rawSearch !== undefined) {
    const trimmed = rawSearch.trim();
    if (trimmed.length > 100) {
      errors.push({
        field: "search",
        message: "Search keyword cannot exceed 100 characters.",
      });
    } else if (trimmed.length > 0) {
      search = trimmed;
    }
  }

  // Location filters
  let state: string | undefined = undefined;
  const rawState = searchParams.get("state");
  if (rawState) {
    const trimmed = rawState.trim();
    if (trimmed.length > 50) {
      errors.push({
        field: "state",
        message: "State name cannot exceed 50 characters.",
      });
    } else if (trimmed.length > 0) {
      state = trimmed;
    }
  }

  let city: string | undefined = undefined;
  const rawCity = searchParams.get("city");
  if (rawCity) {
    const trimmed = rawCity.trim();
    if (trimmed.length > 50) {
      errors.push({
        field: "city",
        message: "City name cannot exceed 50 characters.",
      });
    } else if (trimmed.length > 0) {
      city = trimmed;
    }
  }

  // Ownership filter
  let ownership: CollegeOwnership | undefined = undefined;
  const rawOwnership = searchParams.get("ownership");
  if (rawOwnership) {
    const upper = rawOwnership.trim().toUpperCase();
    if (Object.values(CollegeOwnership).includes(upper as CollegeOwnership)) {
      ownership = upper as CollegeOwnership;
    } else {
      errors.push({
        field: "ownership",
        message: `Invalid ownership value. Accepted values: ${Object.values(
          CollegeOwnership
        ).join(", ")}.`,
      });
    }
  }

  // Degree filter
  let degree: DegreeLevel | undefined = undefined;
  const rawDegree = searchParams.get("degree");
  if (rawDegree) {
    const upper = rawDegree.trim().toUpperCase();
    if (Object.values(DegreeLevel).includes(upper as DegreeLevel)) {
      degree = upper as DegreeLevel;
    } else {
      errors.push({
        field: "degree",
        message: `Invalid degree value. Accepted values: ${Object.values(
          DegreeLevel
        ).join(", ")}.`,
      });
    }
  }

  // Fee filter
  let minFee: number | undefined = undefined;
  const rawMinFee = searchParams.get("minFee");
  if (rawMinFee !== null && rawMinFee !== "") {
    const parsed = Number(rawMinFee);
    if (isNaN(parsed) || !Number.isFinite(parsed) || parsed < 0) {
      errors.push({
        field: "minFee",
        message: "Minimum fee must be a non-negative number.",
      });
    } else {
      minFee = Math.floor(parsed);
    }
  }

  let maxFee: number | undefined = undefined;
  const rawMaxFee = searchParams.get("maxFee");
  if (rawMaxFee !== null && rawMaxFee !== "") {
    const parsed = Number(rawMaxFee);
    if (isNaN(parsed) || !Number.isFinite(parsed) || parsed < 0) {
      errors.push({
        field: "maxFee",
        message: "Maximum fee must be a non-negative number.",
      });
    } else {
      maxFee = Math.floor(parsed);
    }
  }

  if (minFee !== undefined && maxFee !== undefined && minFee > maxFee) {
    errors.push({
      field: "feeRange",
      message: "minFee cannot be greater than maxFee.",
    });
  }

  // Rating filter
  let minRating: number | undefined = undefined;
  const rawMinRating = searchParams.get("minRating");
  if (rawMinRating !== null && rawMinRating !== "") {
    const parsed = Number(rawMinRating);
    if (isNaN(parsed) || parsed < 0 || parsed > 5) {
      errors.push({
        field: "minRating",
        message: "minRating must be a number between 0 and 5.",
      });
    } else {
      minRating = parsed;
    }
  }

  // Sort parameter
  let sortBy: (typeof VALID_SORT_OPTIONS)[number] = "rating";
  const rawSortBy = searchParams.get("sortBy");
  if (rawSortBy) {
    const lower = rawSortBy.toLowerCase();
    if (VALID_SORT_OPTIONS.includes(lower as (typeof VALID_SORT_OPTIONS)[number])) {
      sortBy = lower as (typeof VALID_SORT_OPTIONS)[number];
    } else {
      errors.push({
        field: "sortBy",
        message: `Invalid sortBy option. Allowed values: ${VALID_SORT_OPTIONS.join(
          ", "
        )}.`,
      });
    }
  }

  // Pagination - Page
  let page = 1;
  const rawPage = searchParams.get("page");
  if (rawPage !== null && rawPage !== "") {
    const parsed = parseInt(rawPage, 10);
    if (isNaN(parsed) || parsed < 1) {
      errors.push({
        field: "page",
        message: "Page must be an integer greater than or equal to 1.",
      });
    } else {
      page = parsed;
    }
  }

  // Pagination - PageSize
  let pageSize = 10;
  const rawPageSize = searchParams.get("pageSize") || searchParams.get("limit");
  if (rawPageSize !== null && rawPageSize !== "") {
    const parsed = parseInt(rawPageSize, 10);
    if (isNaN(parsed) || parsed < 1 || parsed > 50) {
      errors.push({
        field: "pageSize",
        message: "pageSize must be an integer between 1 and 50.",
      });
    } else {
      pageSize = parsed;
    }
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
    };
  }

  return {
    isValid: true,
    data: {
      search,
      state,
      city,
      ownership,
      degree,
      minFee,
      maxFee,
      minRating,
      sortBy,
      page,
      pageSize,
    },
  };
}
