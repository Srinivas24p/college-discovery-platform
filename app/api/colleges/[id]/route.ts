import { NextRequest, NextResponse } from "next/server";
import { getCollegeByIdOrSlug } from "@/lib/services/collegeService";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  _request: NextRequest,
  context: RouteParams
) {
  try {
    const { id } = await context.params;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "College ID or slug is required.",
          },
        },
        { status: 400 }
      );
    }

    const trimmed = id.trim();
    if (trimmed.length > 100) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "College identifier cannot exceed 100 characters.",
          },
        },
        { status: 400 }
      );
    }

    const college = await getCollegeByIdOrSlug(trimmed);

    if (!college) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: `College '${trimmed}' does not exist in the database.`,
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: college,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching college by ID:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected server error occurred.";

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to load college details from database.",
          details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
        },
      },
      { status: 500 }
    );
  }
}
