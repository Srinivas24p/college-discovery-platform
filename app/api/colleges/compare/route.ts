import { NextRequest, NextResponse } from "next/server";
import { getCollegesForComparison } from "@/lib/services/collegeService";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    // Collect IDs from both comma-separated 'ids' and repeated 'id' or 'college' params
    const rawIds = [
      ...(searchParams.get("ids")?.split(",") || []),
      ...searchParams.getAll("id"),
      ...searchParams.getAll("college"),
      searchParams.get("college1"),
      searchParams.get("college2"),
      searchParams.get("college3"),
    ].filter((id): id is string => Boolean(id && id.trim().length > 0));

    // Deduplicate
    const uniqueIds = Array.from(new Set(rawIds.map((id) => id.trim())));

    if (uniqueIds.length === 0) {
      return NextResponse.json(
        {
          success: true,
          data: [],
          count: 0,
          message: "No colleges specified for comparison.",
        },
        { status: 200 }
      );
    }

    if (uniqueIds.length > 3) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "LIMIT_EXCEEDED",
            message: "Maximum 3 colleges can be compared simultaneously.",
          },
        },
        { status: 400 }
      );
    }

    const colleges = await getCollegesForComparison(uniqueIds);

    return NextResponse.json(
      {
        success: true,
        data: colleges,
        count: colleges.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error comparing colleges:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected server error occurred.";

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to compare selected colleges.",
          details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
        },
      },
      { status: 500 }
    );
  }
}
