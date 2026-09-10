import type { Review } from "@/lib/generated/prisma/client";

interface CollegeReviewsProps {
  reviews: Review[];
  overallRating: number;
}

export default function CollegeReviews({
  reviews,
  overallRating,
}: CollegeReviewsProps) {
  if (reviews.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Student & Alumni Reviews
        </h2>
        <p className="mt-2 text-xs text-slate-500">No verified reviews posted yet.</p>
      </div>
    );
  }

  return (
    <div id="reviews" className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Student & Alumni Reviews
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Authentic feedback from verified current students and graduates
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-amber-500">★</span>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {overallRating.toFixed(1)}
          </span>
          <span className="text-xs text-slate-400">/ 5.0 ({reviews.length} reviews)</span>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-800/30"
          >
            {/* Header: Author, Role, Rating */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {review.authorName}
                  </h4>
                  {review.isVerified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      ✓ Verified
                    </span>
                  )}
                </div>
                {review.authorRole && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {review.authorRole}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1 rounded bg-amber-50 px-2 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                <span>★</span>
                <span>{review.rating.toFixed(1)}</span>
              </div>
            </div>

            {/* Review Title & Comment */}
            <div>
              <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                &ldquo;{review.title}&rdquo;
              </h5>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {review.comment}
              </p>
            </div>

            {/* Pros & Cons */}
            {(review.pros || review.cons) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                {review.pros && (
                  <div className="rounded-lg bg-emerald-50/60 p-3 border border-emerald-200/60 dark:bg-emerald-950/20 dark:border-emerald-900/40">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1 mb-1">
                      <span>👍</span> Pros:
                    </span>
                    <p className="text-emerald-900 dark:text-emerald-200/90 leading-normal">
                      {review.pros}
                    </p>
                  </div>
                )}

                {review.cons && (
                  <div className="rounded-lg bg-rose-50/60 p-3 border border-rose-200/60 dark:bg-rose-950/20 dark:border-rose-900/40">
                    <span className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1 mb-1">
                      <span>👎</span> Cons:
                    </span>
                    <p className="text-rose-900 dark:text-rose-200/90 leading-normal">
                      {review.cons}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Sub-ratings */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-700/60">
              {review.campusLifeRating && (
                <span>Campus Life: ★ {review.campusLifeRating.toFixed(1)}</span>
              )}
              {review.infrastructureRating && (
                <span>Infrastructure: ★ {review.infrastructureRating.toFixed(1)}</span>
              )}
              {review.facultyRating && (
                <span>Faculty: ★ {review.facultyRating.toFixed(1)}</span>
              )}
              {review.placementRating && (
                <span>Placements: ★ {review.placementRating.toFixed(1)}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
