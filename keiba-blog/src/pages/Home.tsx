import { Link } from "react-router-dom";
import MetaTags from "../component/MetaTags";
import { CATEGORY_CONFIG, SITE_DESCRIPTION, SITE_NAME } from "../utils/site";

const sections = [
  { ...CATEGORY_CONFIG.blog, description: "馬券・予想印などの一般記事" },
  { ...CATEGORY_CONFIG.study, description: "競馬予想の研究・ノート" },
  { ...CATEGORY_CONFIG.analysis, description: "レースごとの分析記事" },
  { ...CATEGORY_CONFIG.predict, description: "レース予想記事" },
] as const;

export default function Home() {
  return (
    <>
      <MetaTags
        title={SITE_NAME}
        description={SITE_DESCRIPTION}
        path="/"
      />
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900">{SITE_NAME}</h1>
        <p className="mt-4 text-gray-600">{SITE_DESCRIPTION}</p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {sections.map(({ label, path, description }) => (
            <li key={path}>
              <Link
                to={path}
                className="block rounded-lg border border-gray-200 p-5 transition hover:border-blue-300 hover:shadow-sm"
              >
                <h2 className="text-lg font-semibold text-gray-900">{label}</h2>
                <p className="mt-1 text-sm text-gray-600">{description}</p>
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/profile"
              className="block rounded-lg border border-gray-200 p-5 transition hover:border-blue-300 hover:shadow-sm"
            >
              <h2 className="text-lg font-semibold text-gray-900">プロフィール</h2>
              <p className="mt-1 text-sm text-gray-600">運営者の自己紹介</p>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
