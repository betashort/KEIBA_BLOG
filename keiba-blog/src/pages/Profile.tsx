import MetaTags from "../component/MetaTags";
import { SITE_DESCRIPTION, SITE_NAME } from "../utils/site";

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
        <section className="space-y-4 text-gray-700">
          <p>
            競馬が好きな個人が運営するブログです。馬券の買い方、予想の考え方、レース分析などを記録・発信しています。
          </p>
          <h2 className="text-lg font-semibold text-gray-900">サイト概要</h2>
          <p>{SITE_DESCRIPTION}</p>
        </section>
      </div>
    </>
  );
}
