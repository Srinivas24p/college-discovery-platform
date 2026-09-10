import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const timestamp = new Date().toISOString();
  let dbStatus: "connected" | "error" = "connected";
  let dbError: string | null = null;
  let collegeCount: number = 0;

  try {
    collegeCount = await prisma.college.count();
  } catch (error) {
    dbStatus = "error";
    dbError = error instanceof Error ? error.message : "Database connection failed";
  }

  return NextResponse.json({
    status: dbStatus === "connected" ? "healthy" : "degraded",
    timestamp,
    environment: process.env.NODE_ENV,
    database: {
      status: dbStatus,
      collegeCount,
      ...(dbError ? { error: dbError } : {}),
    },
  });
}
