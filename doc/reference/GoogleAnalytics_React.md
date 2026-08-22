# 今の構造で Google Analytics 4 を導入する

- [今の構造で Google Analytics 4 を導入する](#今の構造で-google-analytics-4-を導入する)
  - [前提：このサイトの計測方針](#前提このサイトの計測方針)
  - [手順](#手順)
    - [① Google Analytics で測定IDを発行する](#-google-analytics-で測定idを発行する)
    - [② 環境変数に測定IDを置く](#-環境変数に測定idを置く)
    - [③ クライアント側で gtag を読み、SPA 遷移を送る](#-クライアント側で-gtag-を読みspa-遷移を送る)
    - [④ `App.tsx` に載せる（Router の内側）](#-apptsx-に載せるrouter-の内側)
    - [⑤ 本番ビルドしてデプロイし、Realtime で確認する](#-本番ビルドしてデプロイしrealtime-で確認する)
  - [やってはいけないこと](#やってはいけないこと)
  - [確認チェックリスト](#確認チェックリスト)

---

このサイトは **Vite + React + TypeScript** の SPA で、本番 HTML はビルド時プリレンダー、ハイドレーション後は `react-router-dom` で画面遷移する。  
アクセス解析は GA4（Google Analytics 4）を使う。ユニバーサルアナリティクス（`UA-`）は使わない。

実装の実体は次のとおり。

| ファイル | 役割 |
| -------- | ---- |
| `keiba-blog/src/component/GoogleAnalytics.tsx` | マウント後に gtag を読み、パス変更で `page_view` を送る |
| `keiba-blog/src/App.tsx` | `BrowserRouter` / `StaticRouter` の内側でコンポーネントを載せる |
| `keiba-blog/.env.example` | `VITE_GA_MEASUREMENT_ID` のひな型 |
| `keiba-blog/src/vite-env.d.ts` | 測定IDと `window.gtag` の型 |

広告（`AdUnit`）と同じく、**プリレンダー中はネットワークへ出さない**。計測はマウント後だけ動かす（アーキテクチャ設計書 §3.4.2 / §6.7）。

---

## 前提：このサイトの計測方針

1. `index.html` に公式スニペットを直書きしない。プリレンダーがこのテンプレートを全 URL に複製するため、初期 PV と React 側の `page_view` が二重になりやすい。
2. `useEffect` 内でのみ `gtag.js` を挿入する。`renderToString` では `useEffect` が走らないので、ビルド時プリレンダーは計測しない。
3. クライアント遷移（`/` → `/blog/...` など）は URL が変わってもフルリロードしない。location 変化を見て仮想ページビューを送る。
4. 測定IDは Vite の環境変数 `VITE_GA_MEASUREMENT_ID` に置く。未設定なら何も送らない（ローカル・Storybook 向け）。
5. `GoogleAnalytics` は `App.tsx` に置く。Storybook は `App` を使わず `AppShell` だけを載せるので、プレビューから計測が飛ばない。

---

## 手順

### ① Google Analytics で測定IDを発行する

1. [Google Analytics](https://analytics.google.com/) にログインする。
2. 管理 → アカウント作成（未作成時）→ プロパティ作成。
3. プロパティは **Google Analytics 4** を選ぶ。
4. データストリームで **ウェブ** を追加する。
   - ウェブサイトの URL は `SITE_ORIGIN`（`keiba-blog/src/utils/site.ts` / `VITE_SITE_ORIGIN`）と一致させる。末尾スラッシュなし。
   - ストリーム名はサイト名でよい（例: 競馬βLab）。
5. 表示される **測定ID**（`G-` から始まる）を控える。
6. 同じ管理画面で Google シグナルやデータ保持期間を必要に応じて設定する。必須ではない。

Search Console の登録はこの手順の対象外。sitemap は既にビルドで出しているので、解析とは別に Search Console へ `sitemap.xml` を登録する。

---

### ② 環境変数に測定IDを置く

Vite はビルド時に `VITE_` で始まる値をクライアントへ埋め込む。Xserver にランタイムは無いので、**デプロイ前の `npm run build` 時点**で ID が入っている必要がある。

`keiba-blog/.env` を作る（`.gitignore` 済み。リポジトリには置かない）。

```bash
# keiba-blog/.env
VITE_SITE_ORIGIN=https://your-domain.example
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

ひな型は `keiba-blog/.env.example`。

- ローカル開発で計測したくないときは `VITE_GA_MEASUREMENT_ID` を空のままにする。
- Docker でビルドする場合も、コンテナから見える `keiba-blog/.env` に書けば Vite が読む。
- ID を変えたあとは必ず再ビルドする。既に出した `dist/` の JS には古い値が焼き付いている。

---

### ③ クライアント側で gtag を読み、SPA 遷移を送る

`GoogleAnalytics` は次だけ行う。

1. 測定IDが空なら何もしない。
2. 初回マウントで `https://www.googletagmanager.com/gtag/js?id=G-...` を 1 本だけ挿入する。
3. `config` で `send_page_view: false` にする（自動 PV と自前 PV の二重送信を避ける）。
4. `useLocation()` の `pathname` / `search` / `hash` が変わるたびに `page_view` を送る。
5. `document.title` は Helmet 更新を待つため、送信は `setTimeout(0)` にずらす。

カスタムイベント（例: 広告クリック）が必要になったら、同じ `window.gtag('event', ...)` をコンポーネントから呼べばよい。初期導入ではページビューだけで足りる。

---

### ④ `App.tsx` に載せる（Router の内側）

`useLocation()` が使える場所は `BrowserRouter`（クライアント）と `StaticRouter`（プリレンダー）の内側だけ。  
ルート定義と同じ `App` に置く。

```tsx
<>
  <GoogleAnalytics />
  <AppShell>
    <Routes>
      {/* 既存ルート */}
    </Routes>
  </AppShell>
</>
```

`entry-client.tsx` や `index.html` には書かない。`AppShell` にも書かない（Storybook の `withAppLayout` が `AppShell` を使うため）。

---

### ⑤ 本番ビルドしてデプロイし、Realtime で確認する

1. `keiba-blog` で `npm run build`（型チェック → Vite → プリレンダー → sitemap）。
2. `dist/` を Xserver の公開ディレクトリへアップロードする（既存の静的デプロイと同じ）。
3. 本番ドメインでトップを開き、記事へ内部リンクで遷移する。
4. GA4 の **レポート → リアルタイム** で、自分の閲覧とパス変化が見えることを確認する。
5. ブラウザの開発者ツールで `gtag/js?id=G-` が 1 回だけ読み込まれ、以降の遷移で追加の `page_view` が飛んでいることを確認する。

反映まで数秒〜数十秒かかることがある。広告ブロッカーやトラッキング防止が ON だと自分の計測は見えない。

---

## やってはいけないこと

| 避けたいこと | 理由 |
| ------------ | ---- |
| `index.html` に公式タグを貼るだけ | 初回 PV は取れるが、SPA 遷移がページビューにならない。プリレンダー HTML 全ページに複製される |
| プリレンダー（`entry-server.tsx`）から gtag を呼ぶ | `window` が無く、ビルドが落ちる。クローラ向け HTML に計測を混ぜない方針と衝突する |
| `AppShell` に載せる | Storybook からも計測が飛ぶ |
| 測定IDをソースに直書きする | 環境ごとの ON/OFF ができず、誤って開発 PV が混ざる |
| `send_page_view` を true のまま `config` し、さらに `page_view` を送る | 初回だけ PV が二重になる |

---

## 確認チェックリスト

- [ ] 測定IDが `G-` で始まっている
- [ ] データストリームの URL が `SITE_ORIGIN` と一致している
- [ ] 本番ビルド前に `VITE_GA_MEASUREMENT_ID` が入っている
- [ ] プリレンダー済み HTML の `<head>` に gtag が焼き付いていない（マウント後に挿入される）
- [ ] トップ表示と、ヘッダー／カードからの SPA 遷移の両方がリアルタイムに出る
- [ ] ローカルで ID を空にするとリクエストが飛ばない
