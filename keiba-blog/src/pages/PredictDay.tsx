import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Breadcrumb from "../component/Breadcrumb";
import MetaTags from "../component/MetaTags";
import NotFound from "./NotFound";
import { getPredictDay, type PredictMark } from "../data/predictMeetings";
import { predictDayPath } from "../utils/predictUrl";
import { CATEGORY_CONFIG, SITE_DESCRIPTION } from "../utils/site";

const MARK_ORDER: PredictMark[] = ["◎", "〇", "▲", "△", "★"];

export default function PredictDay() {
  const { date } = useParams<{ date: string }>();
  const day = date ? getPredictDay(date) : undefined;
  const config = CATEGORY_CONFIG.predict;
  const [venue, setVenue] = useState(day?.meetings[0]?.venue ?? "");

  if (!date || !day) {
    return <NotFound />;
  }

  const activeVenue = day.meetings.some((meeting) => meeting.venue === venue)
    ? venue
    : day.meetings[0].venue;
  const meeting = day.meetings.find((item) => item.venue === activeVenue);

  return (
    <>
      <MetaTags
        title={`${day.label} レース予想`}
        description={`${day.label}の競馬場・レースごとの予想。${SITE_DESCRIPTION}`}
        path={predictDayPath(day.meetings[0].compactDate)}
      />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Breadcrumb
          items={[
            { label: "ホーム", path: "/" },
            { label: config.label, path: config.path },
            { label: day.label },
          ]}
        />
        <h1 className="mb-6 text-2xl font-bold text-gray-900">{day.label}</h1>

        <div
          role="tablist"
          aria-label="競馬場"
          className="mb-6 flex gap-2 border-b border-gray-200"
        >
          {day.meetings.map((item) => {
            const selected = item.venue === activeVenue;
            return (
              <button
                key={item.venue}
                type="button"
                role="tab"
                aria-selected={selected}
                className={`px-3 py-2 text-sm ${
                  selected
                    ? "border-b-2 border-blue-600 font-semibold text-blue-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setVenue(item.venue)}
              >
                {item.venue}
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
                {race.detailPath ? (
                  <p className="mt-3">
                    <Link
                      to={race.detailPath}
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
      </div>
    </>
  );
}
