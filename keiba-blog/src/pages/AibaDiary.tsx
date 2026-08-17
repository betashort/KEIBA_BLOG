import { useParams } from "react-router-dom";
import Breadcrumb from "../component/Breadcrumb";
import ClubMark from "../component/ClubMark";
import DummyBadge from "../component/DummyBadge";
import MetaTags from "../component/MetaTags";
import {
  formatPrizeMan,
  getClub,
  getHorse,
  sexTextClass,
} from "../data/hitokuchiHorses";
import { formatDate } from "../utils/markdown";
import { SITE_DESCRIPTION } from "../utils/site";
import NotFound from "./NotFound";

/**
 * UI設計: profile/aiba-diary.md
 * 出資馬ごとの日記・観戦記・思い出
 */
export default function AibaDiary() {
  const { bamei } = useParams<{ bamei: string }>();
  const horse = bamei ? getHorse(bamei) : undefined;

  if (!bamei || !horse) {
    return <NotFound />;
  }

  const club = getClub(horse.clubId);
  const path = `/profile/hitokuchi-portfolio/${horse.bamei}`;

  return (
    <>
      <MetaTags
        title={`${horse.name}｜愛馬日記`}
        description={
          horse.description
            ? horse.description
            : `${horse.name}の日記・観戦記。${SITE_DESCRIPTION}`
        }
        ogType="article"
        path={path}
      />
      <article className="mx-auto max-w-3xl px-4 py-8">
        <Breadcrumb
          items={[
            { label: "ホーム", path: "/" },
            { label: "プロフィール", path: "/profile" },
            {
              label: "一口馬主ポートフォリオ",
              path: "/profile/hitokuchi-portfolio",
            },
            { label: horse.name },
          ]}
        />
        <header className="mb-6 border-b border-gray-200 pb-4">
          <h1
            className={`flex flex-wrap items-center gap-2 text-2xl font-bold ${sexTextClass(horse.sex)}`}
          >
            {horse.name}
            <DummyBadge />
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-700">
            {club ? (
              <>
                <ClubMark club={club} />
                <span>{club.name}</span>
                <span aria-hidden="true">/</span>
              </>
            ) : null}
            <span>{horse.className}</span>
            <span aria-hidden="true">/</span>
            <span>{horse.record}</span>
            <span aria-hidden="true">/</span>
            <span>{formatPrizeMan(horse.prizeMan)}</span>
          </div>
          <p className="mt-2 text-sm text-gray-600">{horse.stable}</p>
        </header>

        <div
          className="article-body prose prose-gray max-w-none"
          dangerouslySetInnerHTML={{ __html: horse.contentHtml }}
        />

        {horse.photos.length > 0 ? (
          <section className="mt-8" aria-label="写真">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">写真</h2>
            <ul className="grid grid-cols-2 gap-3">
              {horse.photos.map((photo) => (
                <li key={photo.alt}>
                  <div className="flex aspect-[4/3] items-center justify-center bg-gray-200 text-sm text-gray-500">
                    {photo.alt}
                  </div>
                  {photo.caption ? (
                    <p className="mt-1 text-xs text-gray-600">{photo.caption}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {horse.events.length > 0 ? (
          <section className="mt-8" aria-label="出走・イベント">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              出走体験・イベント
            </h2>
            <ul className="space-y-2 text-sm text-gray-700">
              {horse.events.map((event) => (
                <li key={`${event.date}-${event.title}`}>
                  <time dateTime={event.date}>{formatDate(event.date)}</time>
                  <span className="ml-2 font-medium text-gray-900">
                    {event.title}
                  </span>
                  {event.detail ? (
                    <span className="ml-2 text-gray-600">{event.detail}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>
    </>
  );
}
