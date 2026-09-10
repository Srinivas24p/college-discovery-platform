import type { Course } from "@/lib/generated/prisma/client";
import { formatCurrency } from "@/lib/utils/format";

interface CollegeFeesAndCoursesProps {
  courses: Course[];
}

export default function CollegeFeesAndCourses({
  courses,
}: CollegeFeesAndCoursesProps) {
  if (courses.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Courses & Fee Structure
        </h2>
        <p className="mt-2 text-xs text-slate-500">No courses listed currently.</p>
      </div>
    );
  }

  return (
    <div id="courses" className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 scroll-mt-24">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Courses & Fee Structure
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {courses.length} academic programs available for admissions
          </p>
        </div>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {courses.map((course) => (
          <div
            key={course.id}
            className="py-4 first:pt-2 last:pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1 max-w-xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {course.degree.replace("_", ".")}
                </span>
                <span className="text-xs text-slate-400">
                  {course.durationYears} Years Full-Time
                </span>
                {course.totalSeats && (
                  <span className="text-xs text-slate-400">
                    • {course.totalSeats} Seats
                  </span>
                )}
              </div>

              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {course.name}
              </h4>

              {course.specialization && (
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Specialization: {course.specialization}
                </p>
              )}

              {course.eligibilityCriteria && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal pt-0.5">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Eligibility:
                  </span>{" "}
                  {course.eligibilityCriteria}
                </p>
              )}
            </div>

            <div className="sm:text-right">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Annual Tuition Fee
              </span>
              <p className="text-lg font-extrabold text-slate-900 dark:text-white">
                {formatCurrency(course.annualTuitionFee)}
                <span className="text-xs font-normal text-slate-400">/yr</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
