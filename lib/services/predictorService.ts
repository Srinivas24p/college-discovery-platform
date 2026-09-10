import { prisma } from "@/lib/prisma";
import type { SupportedExam } from "@/lib/validations/predictor";

export type AdmissionProbability = "SAFE" | "TARGET" | "REACH";

export interface PredictedCollegeOption {
  college: {
    id: string;
    name: string;
    slug: string;
    ownership: string;
    rating: number;
    nirfRanking: number | null;
    location: {
      city: string;
      state: string;
    };
    latestPlacement: {
      highestPackageLPA: number;
      averagePackageLPA: number;
      academicYear: string;
    } | null;
  };
  course: {
    id: string;
    name: string;
    degree: string;
    annualTuitionFee: number;
  };
  cutoff: {
    examName: string;
    academicYear: number;
    round: number;
    category: string;
    quota: string;
    openingRank: number;
    closingRank: number;
  };
  probability: AdmissionProbability;
  probabilityPercent: number;
  rankDelta: number; // Positive means rank is comfortably below closing cutoff (safer)
  explanation: string;
}

export interface PredictionResult {
  query: {
    exam: SupportedExam;
    rank: number;
    category: string;
    quota?: string;
  };
  summary: {
    totalRecommendations: number;
    safeCount: number;
    targetCount: number;
    reachCount: number;
  };
  recommendations: PredictedCollegeOption[];
}

/**
 * Predicts college admissions deterministically by evaluating candidate rank
 * against historical closing cutoffs stored in PostgreSQL.
 */
export async function predictColleges(params: {
  exam: SupportedExam;
  rank: number;
  category: string;
  quota?: string;
  maxFee?: number;
}): Promise<PredictionResult> {
  const { exam, rank, category, quota, maxFee } = params;

  // 1. Fetch cutoffs for the specified exam from PostgreSQL
  // We query all cutoffs for this exam, and match by category (or fallback to General)
  const cutoffs = await prisma.cutoff.findMany({
    where: {
      examName: {
        equals: exam,
        mode: "insensitive",
      },
      category: {
        equals: category,
        mode: "insensitive",
      },
      ...(quota
        ? {
            quota: {
              equals: quota,
              mode: "insensitive",
            },
          }
        : {}),
    },
    include: {
      college: {
        include: {
          location: true,
          placements: {
            orderBy: { academicYear: "desc" },
            take: 1,
          },
        },
      },
      course: true,
    },
    orderBy: {
      closingRank: "asc",
    },
  });

  // If no cutoffs found for a specialized category, fall back to "General"
  let matchedCutoffs = cutoffs;
  if (matchedCutoffs.length === 0 && category.toLowerCase() !== "general") {
    matchedCutoffs = await prisma.cutoff.findMany({
      where: {
        examName: { equals: exam, mode: "insensitive" },
        category: { equals: "General", mode: "insensitive" },
      },
      include: {
        college: {
          include: {
            location: true,
            placements: {
              orderBy: { academicYear: "desc" },
              take: 1,
            },
          },
        },
        course: true,
      },
      orderBy: { closingRank: "asc" },
    });
  }

  // 2. Evaluate candidate rank against historical closing ranks
  const recommendations: PredictedCollegeOption[] = [];

  for (const item of matchedCutoffs) {
    if (!item.course || !item.college) continue;

    // Optional fee filter
    if (maxFee && item.course.annualTuitionFee > maxFee) {
      continue;
    }

    const closingRank = item.closingRank;
    const ratio = rank / closingRank;
    const rankDelta = closingRank - rank; // positive = surplus rank margin

    let probability: AdmissionProbability | null = null;
    let probabilityPercent = 0;
    let explanation = "";

    if (ratio <= 0.85) {
      // High chance / Safe: Rank is comfortably within past cutoff (with >=15% safety buffer)
      probability = "SAFE";
      probabilityPercent = Math.min(98, Math.round(90 + (1 - ratio) * 10));
      explanation = `Your rank (${rank.toLocaleString()}) is comfortably within the previous closing cutoff of ${closingRank.toLocaleString()} by a safety margin of +${rankDelta.toLocaleString()} ranks. Highly favorable admission probability in initial counseling rounds.`;
    } else if (ratio <= 1.05) {
      // Moderate chance / Target: Rank is within ±5% margin of closing cutoff
      probability = "TARGET";
      probabilityPercent = Math.round(55 + (1.05 - ratio) * 100);
      explanation = `Your rank (${rank.toLocaleString()}) is competitive and close to the historical closing cutoff of ${closingRank.toLocaleString()} (delta: ${
        rankDelta >= 0 ? `+${rankDelta.toLocaleString()}` : `${rankDelta.toLocaleString()}`
      }). Solid candidate for regular seat allocation.`;
    } else if (ratio <= 1.25) {
      // Low chance / Reach / Dream: Rank is within +25% above cutoff
      probability = "REACH";
      probabilityPercent = Math.max(20, Math.round(45 - (ratio - 1.05) * 100));
      explanation = `Your rank (${rank.toLocaleString()}) exceeds the previous regular cutoff of ${closingRank.toLocaleString()} by ${Math.abs(
        rankDelta
      ).toLocaleString()} ranks. Feasible during extended, upgrade, or institutional spot counseling rounds.`;
    }

    if (probability) {
      const latestPlacement = item.college.placements[0] || null;

      recommendations.push({
        college: {
          id: item.college.id,
          name: item.college.name,
          slug: item.college.slug,
          ownership: item.college.ownership,
          rating: item.college.rating,
          nirfRanking: item.college.nirfRanking,
          location: {
            city: item.college.location.city,
            state: item.college.location.state,
          },
          latestPlacement: latestPlacement
            ? {
                highestPackageLPA: latestPlacement.highestPackageLPA,
                averagePackageLPA: latestPlacement.averagePackageLPA,
                academicYear: latestPlacement.academicYear,
              }
            : null,
        },
        course: {
          id: item.course.id,
          name: item.course.name,
          degree: item.course.degree,
          annualTuitionFee: item.course.annualTuitionFee,
        },
        cutoff: {
          examName: item.examName,
          academicYear: item.academicYear,
          round: item.round,
          category: item.category,
          quota: item.quota,
          openingRank: item.openingRank,
          closingRank: item.closingRank,
        },
        probability,
        probabilityPercent,
        rankDelta,
        explanation,
      });
    }
  }

  // 3. Sort recommendations: SAFE first, then TARGET, then REACH; then by college NIRF/rating
  const tierWeight: Record<AdmissionProbability, number> = {
    SAFE: 1,
    TARGET: 2,
    REACH: 3,
  };

  recommendations.sort((a, b) => {
    if (tierWeight[a.probability] !== tierWeight[b.probability]) {
      return tierWeight[a.probability] - tierWeight[b.probability];
    }
    // Sub-sort by NIRF ranking if available, else rating
    const nirfA = a.college.nirfRanking ?? 9999;
    const nirfB = b.college.nirfRanking ?? 9999;
    if (nirfA !== nirfB) {
      return nirfA - nirfB;
    }
    return b.college.rating - a.college.rating;
  });

  const safeCount = recommendations.filter((r) => r.probability === "SAFE").length;
  const targetCount = recommendations.filter((r) => r.probability === "TARGET").length;
  const reachCount = recommendations.filter((r) => r.probability === "REACH").length;

  return {
    query: {
      exam,
      rank,
      category,
      quota,
    },
    summary: {
      totalRecommendations: recommendations.length,
      safeCount,
      targetCount,
      reachCount,
    },
    recommendations,
  };
}
