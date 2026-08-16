import { Link } from "react-router-dom";
import MetaTags from "../component/MetaTags";

export default function NotFound() {
  return (
    <>
      <MetaTags title="ページが見つかりません" noindex />
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">404</h1>
        <p className="mt-4 text-gray-600">お探しのページは見つかりませんでした。</p>
        <Link
          to="/"
          className="mt-6 inline-block text-blue-600 hover:underline"
        >
          ホームへ戻る
        </Link>
      </div>
    </>
  );
}
