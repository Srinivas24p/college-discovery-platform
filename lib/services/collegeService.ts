import { prisma } from "@/lib/prisma";
import type { CollegeSearchParams } from "@/lib/validations/college";
import type { CollegeOwnership, DegreeLevel, Prisma } from "@/lib/generated/prisma/client";

export interface CollegeListItem {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string;
  establishedYear: number | null;
  ownership: CollegeOwnership;
  rating: number;
  reviewCount: number;
  nirfRanking: number | null;
  naacGrade: string | null;
  fees: {
    minAnnualFee: number;
    maxAnnualFee: number;
    currency: string;
  };
  location: {
    id: string;
    city: string;
    state: string;
    country: string;
  };
  latestPlacement: {
    academicYear: string;
    highestPackageLPA: number;
    averagePackageLPA: number;
    topRecruiters: string[];
  } | null;
  coursesSummary: {
    totalCount: number;
    sampleCourses: string[];
  };
}

export interface CollegeListResponse {
  items: CollegeListItem[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filtersApplied: {
    search?: string;
    state?: string;
    city?: string;
    ownership?: CollegeOwnership;
    degree?: DegreeLevel;
    minFee?: number;
    maxFee?: number;
    minRating?: number;
    sortBy: string;
  };
}

export async function getColleges(
  params: CollegeSearchParams
): Promise<CollegeListResponse> {
  const {
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
  } = params;

  // 1. Build dynamic where clause
  const where: Prisma.CollegeWhereInput = {};

  if (search) {
    where.name = {
      contains: search,
      mode: "insensitive",
    };
  }

  if (state || city) {
    where.location = {
      is: {
        ...(state ? { state: { equals: state, mode: "insensitive" } } : {}),
        ...(city ? { city: { equals: city, mode: "insensitive" } } : {}),
      },
    };
  }

  if (ownership) {
    where.ownership = {
      equals: ownership,
    };
  }

  if (degree) {
    where.courses = {
      some: {
        degree: degree,
      },
    };
  }

  if (minRating !== undefined) {
    where.rating = {
      gte: minRating,
    };
  }

  // Fee overlap: college fees overlap with requested range
  if (minFee !== undefined && maxFee !== undefined) {
    where.minAnnualFee = { lte: maxFee };
    where.maxAnnualFee = { gte: minFee };
  } else if (minFee !== undefined) {
    where.maxAnnualFee = { gte: minFee };
  } else if (maxFee !== undefined) {
    where.minAnnualFee = { lte: maxFee };
  }

  // 2. Build orderBy clause
  let orderBy: Prisma.CollegeOrderByWithRelationInput[];
  switch (sortBy) {
    case "fee_asc":
      orderBy = [{ minAnnualFee: "asc" }, { rating: "desc" }];
      break;
    case "fee_desc":
      orderBy = [{ maxAnnualFee: "desc" }, { rating: "desc" }];
      break;
    case "nirf":
      orderBy = [{ nirfRanking: "asc" }, { rating: "desc" }];
      break;
    case "name":
      orderBy = [{ name: "asc" }];
      break;
    case "newest":
      orderBy = [{ createdAt: "desc" }];
      break;
    case "rating":
    default:
      orderBy = [{ rating: "desc" }, { reviewCount: "desc" }];
      break;
  }

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  // 3. Execute count and paginated items queries sequentially
  const totalCount = await prisma.college.count({ where });
  const colleges = await prisma.college.findMany({
    where,
    orderBy,
    skip,
    take,
    select: {
      id: true,
      name: true,
      slug: true,
      tagline: true,
      description: true,
      establishedYear: true,
      ownership: true,
      rating: true,
      reviewCount: true,
      nirfRanking: true,
      naacGrade: true,
      minAnnualFee: true,
      maxAnnualFee: true,
      currency: true,
      location: {
        select: {
          id: true,
          city: true,
          state: true,
          country: true,
        },
      },
      placements: {
        orderBy: { academicYear: "desc" },
        take: 1,
        select: {
          academicYear: true,
          highestPackageLPA: true,
          averagePackageLPA: true,
          topRecruiters: true,
        },
      },
      courses: {
        select: {
          name: true,
        },
      },
    },
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // 4. Map to card-level presentation model
  const items: CollegeListItem[] = colleges.map((college) => {
    const latestPlacement = college.placements[0] ?? null;

    return {
      id: college.id,
      name: college.name,
      slug: college.slug,
      tagline: college.tagline,
      description: college.description,
      establishedYear: college.establishedYear,
      ownership: college.ownership,
      rating: college.rating,
      reviewCount: college.reviewCount,
      nirfRanking: college.nirfRanking,
      naacGrade: college.naacGrade,
      fees: {
        minAnnualFee: college.minAnnualFee,
        maxAnnualFee: college.maxAnnualFee,
        currency: college.currency,
      },
      location: college.location,
      latestPlacement: latestPlacement
        ? {
            academicYear: latestPlacement.academicYear,
            highestPackageLPA: latestPlacement.highestPackageLPA,
            averagePackageLPA: latestPlacement.averagePackageLPA,
            topRecruiters: latestPlacement.topRecruiters,
          }
        : null,
      coursesSummary: {
        totalCount: college.courses.length,
        sampleCourses: college.courses.slice(0, 3).map((c) => c.name),
      },
    };
  });

  return {
    items,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    filtersApplied: {
      ...(search ? { search } : {}),
      ...(state ? { state } : {}),
      ...(city ? { city } : {}),
      ...(ownership ? { ownership } : {}),
      ...(degree ? { degree } : {}),
      ...(minFee !== undefined ? { minFee } : {}),
      ...(maxFee !== undefined ? { maxFee } : {}),
      ...(minRating !== undefined ? { minRating } : {}),
      sortBy,
    },
  };
}

export async function getCollegeByIdOrSlug(identifier: string) {
  const trimmed = identifier.trim();
  if (!trimmed) {
    return null;
  }

  const college = await prisma.college.findFirst({
    where: {
      OR: [
        { id: trimmed },
        { slug: trimmed.toLowerCase() },
      ],
    },
    include: {
      location: true,
      courses: {
        orderBy: {
          annualTuitionFee: "asc",
        },
      },
      placements: {
        orderBy: {
          academicYear: "desc",
        },
      },
      reviews: {
        orderBy: {
          createdAt: "desc",
        },
      },
      cutoffs: {
        orderBy: [
          { academicYear: "desc" },
          { closingRank: "asc" },
        ],
      },
    },
  });

  return college;
}

export type CollegeDetailData = NonNullable<
  Awaited<ReturnType<typeof getCollegeByIdOrSlug>>
>;

export async function getCollegesForComparison(identifiers: string[]) {
  // Deduplicate and filter empty
  const unique = Array.from(
    new Set(
      identifiers
        .map((id) => id.trim())
        .filter((id) => id.length > 0)
    )
  ).slice(0, 3); // Max 3

  if (unique.length === 0) {
    return [];
  }

  const colleges = await prisma.college.findMany({
    where: {
      OR: [
        { id: { in: unique } },
        { slug: { in: unique.map((s) => s.toLowerCase()) } },
      ],
    },
    include: {
      location: true,
      courses: {
        select: {
          id: true,
          name: true,
          degree: true,
          annualTuitionFee: true,
          durationYears: true,
        },
        orderBy: {
          annualTuitionFee: "asc",
        },
      },
      placements: {
        orderBy: {
          academicYear: "desc",
        },
        take: 2,
      },
      reviews: {
        select: {
          id: true,
          rating: true,
          campusLifeRating: true,
          infrastructureRating: true,
          facultyRating: true,
          placementRating: true,
        },
      },
    },
  });

  // Preserve user requested order
  const lookup = new Map<string, (typeof colleges)[0]>();
  for (const c of colleges) {
    lookup.set(c.id, c);
    lookup.set(c.slug.toLowerCase(), c);
  }

  const ordered: typeof colleges = [];
  const seenIds = new Set<string>();

  for (const id of unique) {
    const match = lookup.get(id) || lookup.get(id.toLowerCase());
    if (match && !seenIds.has(match.id)) {
      seenIds.add(match.id);
      ordered.push(match);
    }
  }

  return ordered;
}

export type ComparisonCollegeItem = Awaited<
  ReturnType<typeof getCollegesForComparison>
>[number];
