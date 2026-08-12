# UI設計（個別画面）

上位文書: [画面設計書](../screen_design.md)  
関連文書: [機能コンポーネント設計書](../component_design.md) / [アーキテクチャ設計書](../architecture_design.md)

## 目的

[画面設計書](../screen_design.md) の「3. 画面詳細」は URL・概要・表示項目の粒度とする。  
レイアウト構成・ワイヤーフレームなど、実装に必要な詳細は本ディレクトリに画面単位で記載する。

## 文書構成

| 画面名 | URL | 文書 |
| ------ | --- | ---- |
| 共通レイアウト | — | [common.md](./common.md) |
| ホーム | `/` | [home/home.md](./home/home.md) |
| ブログ一覧 | `/blog` | [blog/list.md](./blog/list.md) |
| ブログ記事 | `/blog/{article_name}` | [blog/article.md](./blog/article.md) |
| 競馬研究一覧 | `/study` | [study/list.md](./study/list.md) |
| 競馬研究記事 | `/study/{article_name}` | [study/article.md](./study/article.md) |
| レース分析一覧 | `/analysis` | [analysis/list.md](./analysis/list.md) |
| レース分析記事 | `/analysis/{article_name}` | [analysis/article.md](./analysis/article.md) |
| レース予想一覧 | `/predict` | [predict/list.md](./predict/list.md) |
| レース予想記事 | `/predict/{article_name}` | [predict/article.md](./predict/article.md) |
| プロフィール | `/profile` | [profile/profile.md](./profile/profile.md) |
| 一口馬主ポートフォリオ | `/profile/hitokuchi-portfolio` | [profile/hitokuchi-portfolio.md](./profile/hitokuchi-portfolio.md) |
| 愛馬日記 | `/profile/hitokuchi-portfolio/{bamei}` | [profile/aiba-diary.md](./profile/aiba-diary.md) |
| 馬券ポートフォリオ | `/profile/baken-portfolio` | [profile/baken-portfolio.md](./profile/baken-portfolio.md) |

## 一覧パターン

| パターン | 対象 | 概要 |
| -------- | ---- | ---- |
| 新着カード一覧 | blog / study / analysis | サムネ・タイトル・公開日・タグ。10件/ページ＋ページネーション |
| 開催日・場のレース一覧 | predict | 年・開催日・競馬場タブ。レース行に予想印・買い目。詳細記事は任意リンク |

## 各文書の記載方針

各画面ファイルは次の構成を基本とする（画面により省略可）。

1. 基本情報（URL・対応コンポーネント・画面設計書へのリンク）
2. レイアウト（箇条書き＋ワイヤーフレーム）
9. 変更履歴

## ワイヤー資産の配置

drawio / png は各画面フォルダに同居させる。

| 画面フォルダ | 主な資産 |
| ------------ | -------- |
| `home/` | `HomePage.drawio` / `.png` |
| `blog/` | `KeibaBlog_home.*`（一覧）、`KeibaBlog.*`（記事） |
| `study/` | `KeibaStudyRoom_home.*`（一覧）、`KeibaStudyRoom.*`（記事） |
| `analysis/` | `RACE.drawio`（一覧）、`RaceDetail.drawio` / `PastRaceDetail.drawio`（記事） |
| `predict/` | 当面 `analysis/` のレース系資産を参照 |
| `profile/` | `AboutMe.drawio`（プロフィール）。ポートフォリオ系は当面ワイヤーのみ |

## Storybook スクリーンショット（自動更新）

ワイヤーフレームの直後に、Storybook の実装画面を Playwright で自動撮影した PNG を挿入する。

| 項目 | 内容 |
| ---- | ---- |
| 対応 Story | `keiba-blog/src/**/*.stories.tsx`（各ファイル先頭の `UI設計:` コメントで紐付け） |
| マニフェスト | `keiba-blog/scripts/ui-design-screenshots/manifest.ts` |
| 出力先 | 各画面フォルダの `*-storybook.png` |
| ビューポート | 390×844（モバイルファースト） |

### 実行方法

Storybook 開発サーバーが起動中ならそれを利用する。未起動時は静的ビルド後に一時サーバーで撮影する。

```bash
# Docker Compose 経由（推奨）。Chromium はコンテナ内のシステムパッケージを使う
docker compose exec node sh -c "cd keiba-blog && npm run ui-design:screenshots"

# 開発サーバーを使う場合（別ターミナルで storybook 起動済み）
docker compose exec node sh -c "cd keiba-blog && STORYBOOK_URL=http://127.0.0.1:6006 npm run ui-design:screenshots"
```

再実行すると `<!-- ui-design-screenshot:begin/end -->` マーカー内の画像ブロックを差し替える。新規画面を追加するときは `manifest.ts` にエントリを足し、対応する `.stories.tsx` を用意する。

## 変更履歴

| 日付 | 版 | 内容 | 担当 |
| ---- | -- | ---- | ---- |
| 2026-08-10 | 1.0 | 個別画面 UI 設計ドキュメントを新設 | βshort |
| 2026-08-10 | 1.1 | 既存 drawio/png を各画面フォルダへ移動 | βshort |
| 2026-08-12 | 1.3 | Storybook + Playwright による実装スクリーンショット自動更新を追加 | βshort |
| 2026-08-13 | 1.4 | 一口馬主ポートフォリオ・愛馬日記・馬券ポートフォリオを追加 | βshort |
| 2026-08-13 | 1.5 | 愛馬日記の文書名を aiba-diary.md に変更 | βshort |
