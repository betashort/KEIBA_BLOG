import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DummyBadge from "../component/DummyBadge";
import MetaTags from "../component/MetaTags";
import {
  getPredictDates,
  getPredictMeeting,
  getPredictVenues,
  getPredictYears,
  type PredictMark,
} from "../data/predictMeetings";
import { SITE_DESCRIPTION } from "../utils/site";

const MARK_ORDER: PredictMark[] = ["◎", "〇", "▲", "△", "★"];

export default function PredictList() {
  const years = getPredictYears();
  const [year, setYear] = useState(years[0] ?? new Date().getFullYear());
  const dates = useMemo(() => getPredictDates(year), [year]);
  const [date, setDate] = useState(dates[0] ?? "");
  const venues = useMemo(
    () => (date ? getPredictVenues(year, date) : []),
    [year, date],
  );
  const [venue, setVenue] = useState(venues[0] ?? "");

  const activeDate = dates.includes(date) ? date : (dates[0] ?? "");
  const activeVenues = activeDate
    ? getPredictVenues(year, activeDate)
    : [];
  const activeVenue = activeVenues.includes(venue)
    ? venue
    : (activeVenues[0] ?? "");
  const meeting =
    activeDate && activeVenue
      ? getPredictMeeting(year, activeDate, activeVenue)
      : undefined;

  return (
    <>
      <MetaTags
        title="レース予想"
        description={`開催日・競馬場単位のレース予想一覧。${SITE_DESCRIPTION}`}
        path="/predict"
      />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h1 className="flex flex-wrap items-center gap-2 text-2xl font-bold text-gray-900">
            レース予想
            <DummyBadge />
          </h1>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <span className="sr-only">年</span>
            <select
              className="rounded border border-gray-300 bg-white px-2 py-1"
              value={year}
              onChange={(event) => {
                const nextYear = Number(event.target.value);
                setYear(nextYear);
                const nextDates = getPredictDates(nextYear);
                setDate(nextDates[0] ?? "");
                const nextVenues = nextDates[0]
                  ? getPredictVenues(nextYear, nextDates[0])
                  : [];
                setVenue(nextVenues[0] ?? "");
              }}
            >
              {years.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        </div>

        {dates.length === 0 ? (
          <p className="text-gray-600">開催データはまだありません。</p>
        ) : (
          <>
            <div
              className="mb-4 flex gap-2 overflow-x-auto pb-1"
              aria-label="開催日"
            >
              {dates.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`shrink-0 rounded border px-3 py-1.5 text-sm ${
                    value === activeDate
                      ? "border-blue-600 bg-blue-50 font-semibold text-blue-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    setDate(value);
                    const nextVenues = getPredictVenues(year, value);
                    setVenue(nextVenues[0] ?? "");
                  }}
                >
                  {value}
                </button>
              ))}
            </div>

            <div
              role="tablist"
              aria-label="競馬場"
              className="mb-6 flex gap-2 border-b border-gray-200"
            >
              {activeVenues.map((value) => {
                const selected = value === activeVenue;
                return (
                  <button
                    key={value}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    className={`px-3 py-2 text-sm ${
                      selected
                        ? "border-b-2 border-blue-600 font-semibold text-blue-700"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    onClick={() => setVenue(value)}
                  >
                    {value}
                  </button>
                );
              })}
            </div>

            {!meeting || meeting.races.length === 0 ? (
              <p className="text-gray-600">この日・場のレースはありません。</p>
            ) : (
              <ul className="space-y-4">
                {meeting.races.map((race) => (
                  <li
                    key={`${meeting.venue}-${race.number}`}
                    className="border border-gray-200 p-4"
                  >
                    <p className="font-semibold text-gray-900">
                      R{race.number} {race.name}{" "}
                      <span className="font-normal text-gray-600">
                        {race.className} / {race.course} / {race.runners}頭
                      </span>
                    </p>
                    <dl className="mt-3 space-y-1 text-sm text-gray-700">
                      <div>
                        <dt className="inline font-medium">予想印 </dt>
                        <dd className="inline">
                          {MARK_ORDER.filter((mark) => race.marks[mark]).map(
                            (mark) => (
                              <span key={mark} className="mr-3">
                                {mark} {race.marks[mark]}
                              </span>
                            ),
                          )}
                        </dd>
                      </div>
                      <div>
                        <dt className="inline font-medium">買い目 </dt>
                        <dd className="inline">{race.bets.join(" / ")}</dd>
                      </div>
                    </dl>
                    {race.articleSlug ? (
                      <p className="mt-3">
                        <Link
                          to={`/predict/${race.articleSlug}`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          詳細記事へ
                        </Link>
                      </p>
                    ) : (
                      <p className="mt-3 text-sm text-gray-400">詳細記事なし</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </>
  );
}
