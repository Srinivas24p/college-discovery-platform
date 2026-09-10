export const SUPPORTED_EXAMS = [
  "JEE Advanced",
  "JEE Main",
  "BITSAT",
  "COMEDK",
  "KCET",
  "VITEEE",
] as const;

export type SupportedExam = (typeof SUPPORTED_EXAMS)[number];

export interface PredictorInputParams {
  exam: string;
  rank: number;
  category?: string;
  quota?: string;
  maxFee?: number;
}

export interface PredictorValidationResult {
  isValid: boolean;
  data?: {
    exam: SupportedExam;
    rank: number;
    category: string;
    quota?: string;
    maxFee?: number;
  };
  errors?: {
    field: string;
    message: string;
  }[];
}

export function validatePredictorParams(
  rawExam?: string | null,
  rawRank?: string | number | null,
  rawCategory?: string | null,
  rawQuota?: string | null,
  rawMaxFee?: string | number | null
): PredictorValidationResult {
  const errors: { field: string; message: string }[] = [];

  // 1. Validate Exam
  if (!rawExam || typeof rawExam !== "string" || rawExam.trim() === "") {
    errors.push({
      field: "exam",
      message: `Exam name is required. Supported exams: ${SUPPORTED_EXAMS.join(", ")}.`,
    });
  }

  const trimmedExam = (rawExam || "").trim();
  const matchedExam = SUPPORTED_EXAMS.find(
    (e) => e.toLowerCase() === trimmedExam.toLowerCase()
  );

  if (trimmedExam && !matchedExam) {
    errors.push({
      field: "exam",
      message: `Unsupported exam "${trimmedExam}". Please select from: ${SUPPORTED_EXAMS.join(
        ", "
      )}.`,
    });
  }

  // 2. Validate Rank (positive integer)
  let parsedRank = 0;
  if (rawRank === null || rawRank === undefined || rawRank === "") {
    errors.push({
      field: "rank",
      message: "Entrance rank is required.",
    });
  } else {
    parsedRank = Number(rawRank);
    if (
      isNaN(parsedRank) ||
      !Number.isInteger(parsedRank) ||
      parsedRank < 1 ||
      parsedRank > 2000000
    ) {
      errors.push({
        field: "rank",
        message: "Rank must be a positive whole integer between 1 and 2,000,000.",
      });
    }
  }

  // 3. Category (defaults to "General")
  const category = (rawCategory || "General").trim();

  // 4. Quota (optional)
  const quota = rawQuota ? rawQuota.trim() : undefined;

  // 5. Max fee (optional)
  let maxFee: number | undefined = undefined;
  if (rawMaxFee !== null && rawMaxFee !== undefined && rawMaxFee !== "") {
    const parsedFee = Number(rawMaxFee);
    if (!isNaN(parsedFee) && parsedFee > 0) {
      maxFee = Math.floor(parsedFee);
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
      exam: matchedExam!,
      rank: parsedRank,
      category: category || "General",
      quota,
      maxFee,
    },
  };
}
