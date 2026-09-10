import { NextRequest, NextResponse } from "next/server";
import { validatePredictorParams } from "@/lib/validations/predictor";
import { predictColleges } from "@/lib/services/predictorService";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const rawExam = searchParams.get("exam");
    const rawRank = searchParams.get("rank");
    const rawCategory = searchParams.get("category");
    const rawQuota = searchParams.get("quota");
    const rawMaxFee = searchParams.get("maxFee");

    const validation = validatePredictorParams(
      rawExam,
      rawRank,
      rawCategory,
      rawQuota,
      rawMaxFee
    );

    if (!validation.isValid || !validation.data) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "One or more predictor inputs are invalid.",
            details: validation.errors,
          },
        },
        { status: 400 }
      );
    }

    const results = await predictColleges(validation.data);

    return NextResponse.json(
      {
        success: true,
        data: results,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Prediction API error:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected server error occurred.";

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate college predictions.",
          details: process.env.NODE_ENV === "development" ? message : undefined,
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { exam, rank, category, quota, maxFee } = body;

    const validation = validatePredictorParams(
      exam,
      rank,
      category,
      quota,
      maxFee
    );

    if (!validation.isValid || !validation.data) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "One or more predictor inputs are invalid.",
            details: validation.errors,
          },
        },
        { status: 400 }
      );
    }

    const results = await predictColleges(validation.data);

    return NextResponse.json(
      {
        success: true,
        data: results,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Prediction POST API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "BAD_REQUEST",
          message: "Invalid request payload or malformed JSON.",
        },
      },
      { status: 400 }
    );
  }
}
