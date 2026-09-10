import type { Metadata } from "next";
import { getCollegeByIdOrSlug } from "@/lib/services/collegeService";
import CollegeHeader from "@/components/college-detail/CollegeHeader";
import CollegeOverview from "@/components/college-detail/CollegeOverview";
import CollegeFeesAndCourses from "@/components/college-detail/CollegeFeesAndCourses";
import CollegePlacements from "@/components/college-detail/CollegePlacements";
import CollegeReviews from "@/components/college-detail/CollegeReviews";
import CollegeCutoffs from "@/components/college-detail/CollegeCutoffs";
import DetailNotFound from "@/components/college-detail/DetailNotFound";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const college = await getCollegeByIdOrSlug(id);

  if (!college) {
    return {
      title: "College Not Found — CampusFind",
      description: "The requested college profile could not be found.",
    };
  }

  return {
    title: `${college.name} — Fees, Placements & Cutoffs | CampusFind`,
    description: college.description.slice(0, 160),
  };
}

export default async function CollegeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const college = await getCollegeByIdOrSlug(id);

  if (!college) {
    return <DetailNotFound identifier={id} />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Hero Header */}
      <CollegeHeader college={college} />

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Column (2 spans) */}
        <div className="lg:col-span-2 space-y-8">
          <CollegeOverview college={college} />
          <CollegeFeesAndCourses courses={college.courses} />
          <CollegeCutoffs cutoffs={college.cutoffs} />
          <CollegeReviews
            reviews={college.reviews}
            overallRating={college.rating}
          />
        </div>

        {/* Sidebar Column (1 span) */}
        <div className="lg:col-span-1 space-y-8 lg:sticky lg:top-20">
          <CollegePlacements placements={college.placements} />
        </div>
      </div>
    </div>
  );
}
