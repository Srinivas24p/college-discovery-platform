import type {
  College as PrismaCollege,
  Location as PrismaLocation,
  Course as PrismaCourse,
  Placement as PrismaPlacement,
  Review as PrismaReview,
  Cutoff as PrismaCutoff,
  CollegeOwnership,
  DegreeLevel,
} from "@/lib/generated/prisma/client";

export type {
  PrismaCollege,
  PrismaLocation,
  PrismaCourse,
  PrismaPlacement,
  PrismaReview,
  PrismaCutoff,
  CollegeOwnership,
  DegreeLevel,
};

export interface CollegeWithRelations extends PrismaCollege {
  location: PrismaLocation;
  courses: PrismaCourse[];
  placements: PrismaPlacement[];
  reviews: PrismaReview[];
  cutoffs: PrismaCutoff[];
}

export interface CollegeCardItem {
  id: string;
  name: string;
  slug: string;
  tagline?: string | null;
  ownership: CollegeOwnership;
  rating: number;
  reviewCount: number;
  nirfRanking?: number | null;
  minAnnualFee: number;
  maxAnnualFee: number;
  currency: string;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  location: {
    city: string;
    state: string;
  };
  latestPlacement?: {
    highestPackageLPA: number;
    averagePackageLPA: number;
    academicYear: string;
  } | null;
}

export interface CollegeFilterParams {
  search?: string;
  state?: string;
  city?: string;
  ownership?: CollegeOwnership;
  minFee?: number;
  maxFee?: number;
  minRating?: number;
  degree?: DegreeLevel;
  page?: number;
  pageSize?: number;
  sortBy?: "rating" | "fee_asc" | "fee_desc" | "nirf" | "name";
}

export interface CollegePredictorQuery {
  examName: string;
  rank: number;
  category?: string;
  degree?: DegreeLevel;
  maxFee?: number;
}
