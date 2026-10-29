import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
// import AdUnit from "../component/AdUnit";
import MetaTags from "../component/MetaTags";
import Pagination from "../component/Pagination";
import { getPredictDays } from "../data/predictMeetings";
import { predictDayPath } from "../utils/predictUrl";
import { CATEGORY_CONFIG, SITE_DESCRIPTION } from "../utils/site";

const PAGE_SIZE = 10;

export default function PredictList() {
  const config = CATEGORY_CONFIG.predict;
  const days = getPredictDays();
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(days.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const pageDays = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return days.slice(start, start + PAGE_SIZE);
  }, [days, currentPage]);

  return (
    <>
      <MetaTags
        title={config.label}
        description={`開催日ごとのレース予想。${SITE_DESCRIPTION}`}
        path={config.path}
      />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">{config.label}</h1>
        {/* <AdUnit /> */}
        {days.length === 0 ? (
          <p className="text-gray-600">開催データはまだありません。</p>
        ) : (
          <>
            <ul className="divide-y divide-gray-200 border-t border-b border-gray-200">
              {pageDays.map((day) => (
                <li key={day.compactDate}>
                  <article className="py-4">
                    <Link
                      to={predictDayPath(day.compactDate)}
                      className="flex gap-4"
                    >
                      <div className="flex h-20 w-28 shrink-0 items-center justify-center bg-gray-100 text-xs text-gray-400 sm:h-24 sm:w-36">
                        No Image
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
                          {day.label}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                          {day.venues.join(" / ")}
                        </p>
                      </div>
                    </Link>
                  </article>
                </li>
              ))}
            </ul>
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onChange={setPage}
            />
          </>
        )}
        {/* <AdUnit /> */}
      </div>
    </>
  );
}
