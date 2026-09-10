import Link from "next/link";
import { prisma } from "@/lib/prisma";
import HomeSearch from "@/components/home/HomeSearch";
import { formatCurrency } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

export default async function Home() {
  // 1. Fetch Top Popular Colleges directly from PostgreSQL
  const popularColleges = await prisma.college.findMany({
    take: 6,
    orderBy: [{ rating: "desc" }, { nirfRanking: "asc" }],
    include: {
      location: true,
      placements: {
        orderBy: { academicYear: "desc" },
        take: 1,
      },
    },
  });

  // 2. Fetch prominent locations with college counts for "Explore by Location"
  const locations = await prisma.location.findMany({
    take: 6,
    include: {
      _count: {
        select: {
          colleges: true,
        },
      },
    },
    orderBy: {
      colleges: {
        _count: "desc",
      },
    },
  });

  // 3. Fetch popular courses for "Popular Courses"
  const popularCourses = await prisma.course.findMany({
    take: 4,
    distinct: ["name"],
    include: {
      college: true,
    },
    orderBy: {
      annualTuitionFee: "asc",
    },
  });

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-slate-50 to-white pt-14 pb-16 border-b border-slate-200/80 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100/70 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <span>🎓</span>
            <span>Comprehensive Indian Higher Education Portal</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Find the Right College for Your Future
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Discover premier institutes across India, compare tuition fees, NIRF rankings, and placement statistics side-by-side, and predict your admission chances using competitive exam cutoffs.
          </p>

          {/* Large Search Component */}
          <div className="pt-2">
            <HomeSearch />
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <span className="text-xs font-medium text-slate-400">Quick Actions:</span>
            <Link
              href="/colleges"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
            >
              <span>🏛️</span>
              <span>Explore Colleges</span>
            </Link>
            <Link
              href="/compare"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
            >
              <span>⚖️</span>
              <span>Compare Colleges</span>
            </Link>
            <Link
              href="/predictor"
              className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700 shadow-xs hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900/60 transition-colors"
            >
              <span>🎯</span>
              <span>College Predictor</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* 2. POPULAR COLLEGES SECTION */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                <span>Top Ranked</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Popular Colleges & Institutes
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Premier Indian engineering and technological institutions ranked by NIRF and verified student ratings.
              </p>
            </div>
            <Link
              href="/colleges"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline"
            >
              <span>View All Colleges</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularColleges.map((college) => {
              const latestPlacement = college.placements[0];
              return (
                <div
                  key={college.id}
                  className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <Link
                          href={`/colleges/${college.slug}`}
                          className="font-bold text-slate-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-400 transition-colors line-clamp-1"
                        >
                          {college.name}
                        </Link>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          📍 {college.location?.city}, {college.location?.state}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800">
                        <span>★</span>
                        <span>{college.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {college.description}
                    </p>

                    {/* Metrics Row */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <div>
                        <span className="text-[11px] text-slate-400 block">Annual Tuition</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {formatCurrency(college.minAnnualFee)}/yr
                        </span>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block">Highest Offer</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {latestPlacement ? `₹${latestPlacement.highestPackageLPA} LPA` : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
                    <Link
                      href={`/colleges/${college.slug}`}
                      className="flex-1 text-center rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      View Details
                    </Link>
                    <Link
                      href={`/compare?ids=${college.slug}`}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:text-slate-300 transition-colors"
                    >
                      + Compare
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. EXPLORE BY LOCATION SECTION */}
        <section className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Explore by Location
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Browse premier institutes across India&apos;s leading education and technology hubs.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {locations.map((loc) => (
              <Link
                key={loc.state}
                href={`/colleges?state=${encodeURIComponent(loc.state)}`}
                className="group flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-4 text-center shadow-xs hover:border-blue-500 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-700 text-lg group-hover:bg-blue-600 group-hover:text-white transition-colors dark:bg-slate-800 dark:text-blue-400">
                  📍
                </div>
                <span className="mt-2 text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                  {loc.city}
                </span>
                <span className="text-[10px] text-slate-400">
                  {loc.state}
                </span>
                <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-400 mt-1">
                  {loc._count.colleges} {loc._count.colleges === 1 ? "College" : "Colleges"}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. POPULAR COURSES SECTION */}
        <section className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Popular Courses
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              High-demand undergraduate and postgraduate engineering disciplines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularCourses.map((course) => (
              <Link
                key={course.id}
                href={`/colleges?search=${encodeURIComponent(course.name.replace("B.Tech ", ""))}`}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs hover:border-blue-400 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all"
              >
                <div className="space-y-1">
                  <span className="inline-block rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                    {course.degree.replace("_", ".")}
                  </span>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {course.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Offered at top institutes including {course.college.name.split(" ")[0]}
                  </p>
                </div>
                <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">Starting Fee</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {formatCurrency(course.annualTuitionFee)}/yr
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 5. COLLEGE PREDICTOR CTA SECTION */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 p-8 sm:p-12 text-white shadow-md">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-200 border border-blue-400/30">
              <span>🎯</span>
              <span>Deterministic Admission Predictor</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Know Your Admission Chances with Exam + Rank
            </h2>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
              Enter your JEE Main, JEE Advanced, BITSAT, COMEDK, KCET, or VITEEE rank. Our deterministic algorithm matches your score against verified historical cutoffs to classify your chances into <strong>Safe</strong>, <strong>Target</strong>, and <strong>Reach</strong> colleges.
            </p>
            <div className="pt-2">
              <Link
                href="/predictor"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-xs sm:text-sm font-bold text-blue-900 shadow-sm hover:bg-blue-50 transition-colors"
              >
                <span>Launch College Predictor</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
