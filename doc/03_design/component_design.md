# 機能コンポーネント設計書（競馬ブログ）

上位文書: [アーキテクチャ設計書](./architecture_design.md)  
関連文書: [画面設計書](./screen_design.md)

1. [1. はじめに](#1-はじめに)
   1. [1.1 目的](#11-目的)
   2. [1.2 対象読者](#12-対象読者)
2. [2. 機能設計（処理設計）](#2-機能設計処理設計)
    1. [2.1 機能一覧](#21-機能一覧)
    2. [2.2 機能詳細](#22-機能詳細)
      1. [2.2.1 記事表示](#221-記事表示)
      2. [2.2.2 記事一覧表示](#222-記事一覧表示)
      3. [2.2.3 カテゴリ・タグ管理](#223-カテゴリタグ管理)
      4. [2.2.4 OGP表示](#224-ogp表示)
      5. [2.2.5 広告表示](#225-広告表示)
      6. [2.2.6 ホーム表示](#226-ホーム表示)
      7. [2.2.7 一口馬主ポートフォリオ表示](#227-一口馬主ポートフォリオ表示)
      8. [2.2.8 愛馬日記表示](#228-愛馬日記表示)
      9. [2.2.9 馬券ポートフォリオ表示](#229-馬券ポートフォリオ表示)
      10. [2.2.10 月次馬券成績表示](#2210-月次馬券成績表示)
      11. [2.2.11 404表示](#2211-404表示)
      12. [2.2.12 アクセス解析](#2212-アクセス解析)
3. [3. コンポーネント設計](#3-コンポーネント設計)
   1. [3.1 構成](#31-構成)
   2. [3.2 コンポーネント一覧](#32-コンポーネント一覧)
   3. [3.3 ルーティング](#33-ルーティング)
4. [4. 変更履歴](#4-変更履歴)

<div style="page-break-after: always;"></div>

## 1. はじめに

### 1.1 目的

本書は、競馬ブログシステムの機能処理と React コンポーネントの責務・対応関係を明確にし、  
実装および改修時の指針とすることを目的とする。

### 1.2 対象読者

- 開発者
- テスター
- 保守担当者

<div style="page-break-after: always;"></div>

## 2. 機能設計（処理設計）

### 2.1 機能一覧

| 機能名                   | 概要                                                         |
| ------------------------ | ------------------------------------------------------------ |
| 記事表示                 | Markdownから変換したHTMLを表示                               |
| 記事一覧表示             | 新着順のカード一覧、または開催日単位のレース予想一覧を表示   |
| カテゴリ・タグ管理       | 記事を分類して管理                                           |
| OGP表示                  | SNS共有時のOGP対応                                           |
| 広告表示                 | Google Ads 用の広告枠を表示                                  |
| ホーム表示               | 新着スライドとカテゴリタブ付き新着一覧を表示                 |
| 一口馬主ポートフォリオ表示 | 出資馬のクラス別一覧と分析タブを表示                       |
| 愛馬日記表示             | 出資馬ごとの日記・写真を表示                       |
| 馬券ポートフォリオ表示   | 月次記事から集計した馬券成績・券種別分析・購入履歴を表示     |
| 月次馬券成績表示         | 月次の馬券成績記事（サマリ・本文・券種・履歴）を表示         |
| 404表示                  | 未定義パス・未存在記事・未存在馬名・未存在年月で 404 画面を表示 |
| アクセス解析             | Google Analytics 4 でページビューを計測                      |

### 2.2 機能詳細

#### 2.2.1 記事表示

- 概要：MarkdownをHTMLへ変換し表示する
- 入力：Markdownファイル（`src/articles/{category}/{article_name}/index.md`。predict の注目レースは `src/articles/predict/{YYYY-MM-DD}/{article_name}/index.md`）
- 出力：記事詳細画面
- 処理内容：
  1. `import.meta.glob` でビルド時にMarkdownファイルを収集
  2. `parseFrontMatter`（`js-yaml`）で Front Matter を解析
  3. marked で Markdown 本文を HTML に変換
  4. React コンポーネントで `dangerouslySetInnerHTML` により本文を描画
- 画面実装：
  - **blog / study / predict**：`BlogPost` / `StudyPost` / `PredictPost` が共通の `ArticlePost` に委譲
  - **analysis**：`AnalysisPost` が独自実装。ヘッダーに `raceName`（未設定時は title）と `raceInfo`（未設定時は description）を表示
- セキュリティ：入力元は管理者作成の Markdown のみ。ユーザー入力は受け付けない
- 例外処理：記事未存在時・slug 欠落時は `NotFound` を表示

#### 2.2.2 記事一覧表示

- 概要：カテゴリ別に記事・レース情報を一覧表示する
- 入力：該当カテゴリ（blog / study / analysis / predict）配下の Markdown 一覧。predict の開催データは `src/articles/predict/{YYYY-MM-DD}/index.md`（読込は `src/data/predictMeetings.ts`）
- 出力：一覧画面
- 処理内容：
  - **blog / study / analysis**（カード一覧）
    1. `BlogList` / `StudyList` / `AnalysisList` が共通の `ArticleList` に委譲
    2. Front Matter の `date` を取得し、日付の降順でソート
    3. カード形式でタイトル・日付・サムネイル・タグを表示（10件/ページ＋`Pagination`）
    4. カードクリックで記事詳細へ遷移
    5. 記事が 0 件のときは「記事はまだありません。」を表示
  - **predict**（開催日・競馬場単位のレース一覧）
    1. `PredictList` が開催データから年・開催日・競馬場で対象を絞り込む
    2. レース行に番号・クラス・レース名・コース・頭数・予想印・買い目を表示
    3. 詳細記事があるレースのみ記事詳細へリンク（`articleSlug`。開催日 YAML の指定、または注目レース記事の `venue` + `raceNumber` で自動紐付け）
    4. ダミーデータであることを `DummyBadge` で明示

#### 2.2.3 カテゴリ・タグ管理

- 概要：Front Matter により記事を分類する
- 入力：Front Matter の `category` / `tags`
- 出力：一覧・詳細画面での分類表示、将来のフィルタ拡張
- 処理内容：
  - `category`：`blog` / `study` / `analysis` / `predict` で記事のルート（/blog / /study / /analysis / /predict）を決定（`CATEGORY_CONFIG`）
  - `tags`：文字列配列。記事詳細・一覧カードで表示。タグ別一覧は将来拡張
- 設計方針：DBを使わずファイルベースで拡張可能とする

#### 2.2.4 OGP表示

- 概要：SNS共有時に適切なメタ情報を出力する
- 入力：Front Matter（title, description, ogImage 等）、現在URL
- 出力：HTML `<head>` 内のメタタグ
- 処理内容：
  - 全ページで以下を設定：`og:title`, `og:description`, `og:type`, `og:url`, `og:image`, `og:site_name`
  - Twitter Card：`summary_large_image` 形式
  - `ogImage` 未設定時はサイト共通のデフォルト画像を使用
  - 記事ページ・愛馬日記は `og:type` を `article`、一覧・ホームは `website` とする
  - `noindex` 指定時（Front Matter または 404）は `robots noindex` を出力
- 実装：`MetaTags`（react-helmet-async）でページ単位に head を制御

#### 2.2.5 広告表示

- 概要：Google Ads をサイト内に表示する
- 入力：Google Ads 発行の広告ユニットコード（現状は未接続）
- 出力：固定サイズの広告表示領域
- 処理内容：
  - 記事詳細・カード型一覧の所定位置に `AdUnit` を配置（本文の上下、一覧の上下）
  - 広告読み込み前にプレースホルダ領域（`min-h-[250px]`）を確保し CLS を抑制
  - 現状は「広告枠」プレースホルダ。外部スクリプトは Google 公式のもののみ利用する方針
- 例外処理：広告ブロック環境では表示されない（許容）

#### 2.2.6 ホーム表示

- 概要：サイトトップに新着スライドとカテゴリタブ付き新着一覧を表示する
- 入力：全記事（`getAllArticles` / `getArticlesByCategory`）
- 出力：ホーム画面
- 処理内容：
  1. 全記事を日付降順で最大 5 件スライダー表示（5 秒自動切替、前後ボタン・ドット）
  2. タブ（レース予想 / 競馬研究 / ブログ）でカテゴリを切替。各タブ最大 5 件を `BlogCard`（抜粋あり）で表示
  3. レース分析はホームタブ対象外（一覧 `/analysis` から閲覧）

#### 2.2.7 一口馬主ポートフォリオ表示

- 概要：出資馬の保有状況をクラス別マトリクスと分析タブで表示する
- 入力：`src/articles/hitokuchi/{bamei}/index.md`（馬データ）と `src/data/hitokuchiHorses.ts`（クラブ定義）
- 出力：一口馬主ポートフォリオ画面
- 処理内容：
  1. タブ（出資馬 / 分析）を切替
  2. 出資馬タブ：クラス（オープン〜引退）ごとのマトリクス。馬名クリックで愛馬日記へ遷移
  3. 分析タブ：総出資馬数・現役・引退、クラス別頭数のダミー可視化
  4. 所属クラブは `ClubMark`、ダミーであることは `DummyBadge` で明示

#### 2.2.8 愛馬日記表示

- 概要：出資馬ごとの紹介・日記・観戦記、5代血統、出走成績の簡易分析をタブで表示する
- 入力：URL の `{bamei}` と `src/articles/hitokuchi/{bamei}/`（`index.md` と `{YYYY-MM-DD}-{slug}.md`）
- 出力：愛馬日記画面（日記は個別 URL にせず1ページへ埋め込み）
- 処理内容：
  1. `bamei` で馬を特定。未存在時は `NotFound`
  2. ヘッダーに馬名・英名（任意）・クラブ・クラス・戦績・獲得賞金を表示
  3. タブ（紹介 / 日記 / 血統 / 分析）を切替
  4. 紹介タブ：写真（`photos`。先頭。複数枚はスライドショー）、紹介表（誕生日・毛色・生産牧場・育成牧場・募集価格）、レース成績表
  5. 日記タブ：目次（日付・見出しから該当観戦記へ）、観戦記の埋め込み（各日記の `photos` を見出し直後にスライドショー表示）
  6. 血統タブ：5代血統表（`pedigree` Front Matter。父系は青・母系は赤）
  7. 分析タブ：出走成績からの簡易集計（勝率・着順分布・一口の回収率など）。詳細分析は未定のため注記を表示
- パンくず：ホーム > プロフィール > 一口馬主ポートフォリオ > 馬名

#### 2.2.9 馬券ポートフォリオ表示

- 概要：馬券成績（収支・的中率・回収率）と購入傾向を可視化する
- 入力：`src/articles/baken/{YYYY-MM}/index.md`（月次成績）。集計は `src/data/bakenPortfolio.ts`
- 出力：馬券ポートフォリオ画面
- 処理内容：
  1. 月次記事を集計し、全体サマリ（収支・的中率・回収率）を表示
  2. 年月別収支をバーチャート風に表示。年月は月次記事へリンク
  3. 券種別の件数・的中率・回収率・収支を表で表示
  4. 購入履歴まとめを表で表示
  5. ダミーであることは `DummyBadge` で明示

#### 2.2.10 月次馬券成績表示

- 概要：指定年月の馬券成績記事を表示する
- 入力：URL の `{yearMonth}` と `src/articles/baken/{YYYY-MM}/index.md`
- 出力：月次馬券成績画面
- 処理内容：
  1. `yearMonth` で月次記事を特定。未存在時は `NotFound`
  2. 当月サマリ（収支・的中率・回収率）を表示
  3. Markdown 本文を HTML 化して描画
  4. Front Matter の券種・購入履歴を表で表示
  5. ダミーであることは `DummyBadge` で明示
- パンくず：ホーム > プロフィール > 馬券ポートフォリオ > YYYY年M月

#### 2.2.11 404表示

- 概要：存在しない URL に対して 404 画面を表示する
- 入力：未定義パス、未存在の記事 slug、未存在の `bamei`、未存在の `yearMonth`
- 出力：404 画面（ホームへのリンク、`noindex`）
- 処理内容：
  - `App` の `path="*"` で未定義ルートを捕捉
  - `ArticlePost` / `AnalysisPost` / `AibaDiary` / `BakenMonthlyPost` はデータ未存在時に `NotFound` を描画

#### 2.2.12 アクセス解析

- 概要：GA4 でページビューを計測する
- 入力：`VITE_GA_MEASUREMENT_ID`（未設定時は無効）
- 出力：なし（描画しない）。閲覧者ブラウザから gtag へ `page_view` を送信
- 処理内容：
  - `GoogleAnalytics` を `App`（Router 内側）に置く
  - プリレンダーでは `useEffect` が走らないため送信しない
  - ハイドレーション後に `gtag.js` を 1 回読み、`config` の自動 PV は切る
  - `useLocation` の変化で仮想ページビューを送る（SPA 遷移対応）
- 例外処理：測定ID未設定・広告ブロッカー環境では送られない（許容）
- 詳細手順：[GoogleAnalytics_React.md](../reference/GoogleAnalytics_React.md)

<div style="page-break-after: always;"></div>

## 3. コンポーネント設計

### 3.1 構成

`App.tsx` がルートを定義し、全画面を `AppShell` で包む。

```
App
 ├─ GoogleAnalytics（マウント後の GA4 page_view）
 └─ AppShell
      ├─ Header（ロゴ＋ハンバーガー）
      ├─ SideNav（ドロワー）
      ├─ main > Routes（画面コンポーネント）
      └─ Footer
```

一覧・詳細の共通化：

| 画面ルート | ページコンポーネント | 実体 |
| ---------- | -------------------- | ---- |
| `/blog` `/study` `/analysis` | `BlogList` / `StudyList` / `AnalysisList` | `ArticleList` に委譲 |
| `/blog/:article_name` `/study/:article_name` `/predict/:article_name` | `BlogPost` / `StudyPost` / `PredictPost` | `ArticlePost` に委譲 |
| `/analysis/:article_name` | `AnalysisPost` | レース情報ヘッダー付きの独自実装 |
| `/predict` | `PredictList` | 開催データ駆動の独自実装 |

### 3.2 コンポーネント一覧

**共通レイアウト**

| コンポーネント | 責務 | 関連画面・機能 |
| -------------- | ---- | -------------- |
| AppShell | Header / SideNav / main / Footer の共通枠とナビ開閉状態 | 全画面 |
| GoogleAnalytics | GA4 の gtag 読込と SPA の page_view 送信 | 全画面、アクセス解析 |
| Header | ロゴ・ハンバーガー（SideNav 開閉） | 全画面 |
| SideNav | ドロワー型グローバルナビ | 全画面 |
| Footer | フッター・コピーライト | 全画面 |

**画面**

| コンポーネント | 責務 | 関連画面・機能 |
| -------------- | ---- | -------------- |
| Home | 新着スライド＋カテゴリタブ | ホーム、ホーム表示、OGP表示 |
| BlogList | ブログ記事一覧（`ArticleList` へ委譲） | ブログ一覧、記事一覧表示 |
| StudyList | 研究記事一覧（`ArticleList` へ委譲） | 競馬研究一覧、記事一覧表示 |
| AnalysisList | レース分析記事一覧（`ArticleList` へ委譲） | レース分析一覧、記事一覧表示 |
| PredictList | 開催日・場単位のレース予想一覧 | レース予想一覧、記事一覧表示 |
| BlogPost | ブログ記事詳細（`ArticlePost` へ委譲） | ブログ記事、記事表示、OGP表示 |
| StudyPost | 研究記事詳細（`ArticlePost` へ委譲） | 競馬研究記事、記事表示、OGP表示 |
| AnalysisPost | レース分析記事詳細（レース名・レース情報） | レース分析記事、記事表示、OGP表示 |
| PredictPost | レース予想記事詳細（`ArticlePost` へ委譲） | レース予想記事、記事表示、OGP表示 |
| Profile | プロフィール本文とポートフォリオへの導線 | プロフィール |
| HitokuchiPortfolio | 出資馬マトリクス・分析タブ | 一口馬主ポートフォリオ |
| AibaDiary | 出資馬ごとの紹介／日記／血統／分析タブ | 愛馬日記 |
| BakenPortfolio | 月次記事から集計した馬券成績のサマリ・グラフ・履歴 | 馬券ポートフォリオ |
| BakenMonthlyPost | 月次の馬券成績記事 | 月次馬券成績 |
| NotFound | 404 画面 | 404表示 |

**部品**

| コンポーネント | 責務 | 関連画面・機能 |
| -------------- | ---- | -------------- |
| ArticleList | カード型一覧の共通実装（ページネーション・広告） | blog / study / analysis 一覧 |
| ArticlePost | 記事詳細の共通実装（本文・パンくず・広告・404） | blog / study / predict 詳細 |
| BlogCard | 一覧用記事カード（サムネイル・日付・タグ／抜粋） | 各記事一覧、ホーム |
| Pagination | ページ番号ナビ | カード型一覧 |
| Breadcrumb | パンくずリスト | 記事詳細、ポートフォリオ、愛馬日記、SEO |
| MetaTags | title / description / OGP / Twitter Card / noindex | 全画面、OGP表示 |
| AdUnit | 広告プレースホルダ（CLS 抑制） | 記事詳細・カード型一覧、広告表示 |
| ClubMark | 所属クラブの文字プレースホルダ | 一口馬主ポートフォリオ、愛馬日記 |
| PedigreeTable | 5代血統表 | 愛馬日記 |
| DummyBadge | ダミーデータであることを示すラベル | 予想一覧、ポートフォリオ、愛馬日記 |

**ユーティリティ・データ**

| モジュール | 責務 | 関連画面・機能 |
| ---------- | ---- | -------------- |
| markdown（utils） | Markdown読込・変換・ソート・日付整形 | 記事表示、記事一覧表示、ホーム表示、カテゴリ・タグ管理 |
| frontMatter（utils） | YAML Front Matter 解析（`js-yaml`） | 記事表示、記事一覧表示 |
| site（utils） | サイト名・説明・カテゴリ設定・絶対URL | OGP表示、全画面 |
| routes（utils） | 公開ルート一覧（プリレンダー・sitemap 用） | ビルド、SEO |
| predictMeetings（data） | レース予想一覧の開催データ（`articles/predict/{YYYY-MM-DD}` から読込） | レース予想一覧 |
| hitokuchiHorses（data） | クラブ定義と出資馬記事の読込 | 一口馬主ポートフォリオ、愛馬日記 |
| bakenPortfolio（data） | 月次 article の読込・集計 | 馬券ポートフォリオ、月次馬券成績 |

### 3.3 ルーティング

ルーティング（`App.tsx`）：

| path | コンポーネント |
| ---- | -------------- |
| / | Home |
| /blog | BlogList |
| /blog/:article_name | BlogPost |
| /study | StudyList |
| /study/:article_name | StudyPost |
| /analysis | AnalysisList |
| /analysis/:article_name | AnalysisPost |
| /predict | PredictList |
| /predict/:article_name | PredictPost |
| /profile | Profile |
| /profile/hitokuchi-portfolio | HitokuchiPortfolio |
| /profile/hitokuchi-portfolio/:bamei | AibaDiary |
| /profile/baken-portfolio | BakenPortfolio |
| /profile/baken-portfolio/:yearMonth | BakenMonthlyPost |
| * | NotFound |

<div style="page-break-after: always;"></div>

## 4. 変更履歴

| 日付       | 版  | 内容                                       | 担当   |
| ---------- | --- | ------------------------------------------ | ------ |
| 2026-02-02 | 1.0 | 初版作成（設計書 機能・コンポーネントとして） | βshort |
| 2026-05-23 | 1.1 | 仕様書に基づき更新                         | βshort |
| 2026-05-23 | 1.3 | レース分析・レース予想のコンポーネント・ルーティングを追加 | βshort |
| 2026-08-10 | 2.0 | design.md から機能コンポーネント設計書として分割 | βshort |
| 2026-08-10 | 2.1 | Header をロゴ＋ハンバーガー、SideNav を追加 | βshort |
| 2026-08-10 | 2.2 | 記事一覧をカード型（blog/study/analysis）と開催日型（predict）に整理 | βshort |
| 2026-08-17 | 2.3 | keiba-blog 実装に合わせて更新。AppShell・共通 ArticleList/ArticlePost、ポートフォリオ／愛馬日記／404、Front Matter を js-yaml に反映 | βshort |
| 2026-08-17 | 2.4 | 出資馬・愛馬日記の入力を `src/articles/hitokuchi/{bamei}/index.md` に変更 | βshort |
| 2026-08-17 | 2.5 | 馬券成績を `src/articles/baken/{YYYY-MM}/index.md` で月次管理。月次記事画面を追加 | βshort |
| 2026-08-17 | 2.6 | レース予想の開催データを日付フォルダの Markdown から読むよう更新 | βshort |
| 2026-08-17 | 2.7 | 愛馬日記を個別 Markdown で管理し、レース成績表を同ページに埋め込み | βshort |
| 2026-08-17 | 2.8 | 愛馬日記に日記／分析タブを追加 | βshort |
| 2026-08-17 | 2.9 | 愛馬日記に血統タブと5代血統表を追加 | βshort |
| 2026-08-17 | 2.10 | 愛馬日記に紹介タブを追加し、紹介・レース成績を日記から移した | βshort |
| 2026-08-17 | 2.11 | 愛馬日記の写真を紹介タブ先頭へ移動 | βshort |
| 2026-08-17 | 2.12 | 日記エントリの写真を観戦記に表示 | βshort |
| 2026-08-17 | 2.13 | 愛馬日記の複数写真をスライドショー表示に変更 | βshort |
| 2026-08-17 | 2.14 | 愛馬日記の日記タブに目次を追加 | βshort |
| 2026-08-17 | 2.15 | 愛馬日記の分析タブに一口の回収率を追加 | βshort |
| 2026-08-18 | 2.16 | Google Analytics 4（`GoogleAnalytics`）を追加 | βshort |
| 2026-08-22 | 2.17 | 愛馬日記ヘッダーに英名（`englishName`）を表示 | βshort |
