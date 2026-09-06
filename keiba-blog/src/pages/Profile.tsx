import { Link } from "react-router-dom";
import MetaTags from "../component/MetaTags";
import {
  AUTHOR_DISCLAIMER,
  AUTHOR_FAVORITE_COURSE,
  AUTHOR_FAVORITE_RACE,
  AUTHOR_FAVORITE_TICKETS,
  AUTHOR_ICON,
  AUTHOR_NAME,
  AUTHOR_SOCIALS,
  AUTHOR_STANCE,
  AUTHOR_TITLE,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "../utils/site";

type SocialId = (typeof AUTHOR_SOCIALS)[number]["id"];

function SocialIcon({ id, className }: { id: SocialId; className?: string }) {
  if (id === "x") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path
          fill="currentColor"
          d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.54 9.54 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export default function Profile() {
  return (
    <>
      <MetaTags
        title="プロフィール"
        description={`${SITE_NAME}の運営者プロフィール。${SITE_DESCRIPTION}`}
        path="/profile"
      />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">プロフィール</h1>
        <div className="mb-8 flex items-start gap-4 sm:gap-6">
          <img
            src={AUTHOR_ICON}
            alt={`${AUTHOR_NAME}のアイコン`}
            width={256}
            height={256}
            className="h-28 w-28 shrink-0 rounded-full border border-gray-200 bg-white object-cover sm:h-32 sm:w-32"
          />
          <div className="min-w-0 pt-1">
            <p className="text-xl font-semibold text-gray-900">{AUTHOR_NAME}</p>
            <p className="mt-1 text-sm text-gray-600">{AUTHOR_TITLE}</p>
            <nav aria-label="SNS" className="mt-3 flex flex-wrap gap-2">
              {AUTHOR_SOCIALS.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="inline-flex items-center gap-1.5 border border-gray-300 px-3 py-1.5 text-sm text-gray-800 hover:bg-gray-50"
                >
                  <SocialIcon id={social.id} className="h-4 w-4" />
                  {social.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
        <section className="space-y-4 text-gray-700">
          <p>
            競馬が好きな個人が運営するブログです。馬券の買い方、予想の考え方、レース分析などを記録・発信しています。
          </p>
        </section>
        <section className="mt-8">
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            競馬のスタンス
          </h2>
          <p className="text-gray-700">{AUTHOR_STANCE}</p>
        </section>
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            好きな競馬場・レース・券種
          </h2>
          <dl className="text-sm">
            <div className="flex gap-3 border-t border-gray-200 py-2">
              <dt className="w-16 shrink-0 text-gray-500">競馬場</dt>
              <dd className="text-gray-900">{AUTHOR_FAVORITE_COURSE}</dd>
            </div>
            <div className="flex gap-3 border-t border-gray-200 py-2">
              <dt className="w-16 shrink-0 text-gray-500">レース</dt>
              <dd className="text-gray-900">{AUTHOR_FAVORITE_RACE}</dd>
            </div>
            <div className="flex gap-3 border-y border-gray-200 py-2">
              <dt className="w-16 shrink-0 text-gray-500">券種</dt>
              <dd className="flex flex-wrap gap-1.5">
                {AUTHOR_FAVORITE_TICKETS.map((ticket) => (
                  <span
                    key={ticket}
                    className="border border-gray-300 px-2 py-0.5 text-gray-800"
                  >
                    {ticket}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </section>
        <section className="mt-8 space-y-2 text-gray-700">
          <h2 className="text-lg font-semibold text-gray-900">サイト概要</h2>
          <p>{SITE_DESCRIPTION}</p>
        </section>
        <nav aria-label="関連ページ" className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/profile/hitokuchi-portfolio"
            className="inline-flex items-center border border-gray-300 px-4 py-2 text-sm text-gray-800 hover:bg-gray-50"
          >
            一口馬主ポートフォリオ
          </Link>
          <Link
            to="/profile/baken-portfolio"
            className="inline-flex items-center border border-gray-300 px-4 py-2 text-sm text-gray-800 hover:bg-gray-50"
          >
            馬券ポートフォリオ
          </Link>
        </nav>
        <section className="mt-10" aria-labelledby="profile-disclaimer">
          <h2
            id="profile-disclaimer"
            className="mb-2 text-sm font-semibold text-gray-700"
          >
            免責
          </h2>
          <p className="text-xs leading-relaxed text-gray-500">
            {AUTHOR_DISCLAIMER}
          </p>
        </section>
      </div>
    </>
  );
}
