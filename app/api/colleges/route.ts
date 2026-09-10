import { NextRequest, NextResponse } from "next/server";
import { validateAndParseCollegeQueryParams } from "@/lib/validations/college";
import { getColleges } from "@/lib/services/collegeService";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    // 1. Validate query parameters
    const validationResult = validateAndParseCollegeQueryParams(searchParams);

    if (!validationResult.isValid || !validationResult.data) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "One or more query parameters are invalid.",
            details: validationResult.errors,
          },
        },
        { status: 400 }
      );
    }

    // 2. Query database via dedicated service layer
    const result = await getColleges(validationResult.data);

    // 3. Return consistent structured response
    return NextResponse.json(
      {
        success: true,
        data: result.items,
        pagination: result.pagination,
        filtersApplied: result.filtersApplied,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching colleges:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve colleges from the database.",
          details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
        },
      },
      { status: 500 }
    );
  }
}
