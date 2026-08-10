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
3. [3. コンポーネント設計](#3-コンポーネント設計)
   1. [3.1 コンポーネント一覧](#31-コンポーネント一覧)
   2. [3.2 ルーティング](#32-ルーティング)
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

| 機能名             | 概要                           |
| ------------------ | ------------------------------ |
| 記事表示           | Markdownから変換したHTMLを表示 |
| 記事一覧表示       | 新着順で記事一覧を表示         |
| カテゴリ・タグ管理 | 記事を分類して管理             |
| OGP表示            | SNS共有時のOGP対応             |
| 広告表示           | Google Adsを表示               |

### 2.2 機能詳細

#### 2.2.1 記事表示

- 概要：MarkdownをHTMLへ変換し表示する
- 入力：Markdownファイル（`src/articles/{category}/{article_name}/index.md`）
- 出力：記事詳細画面
- 処理内容：
  1. `import.meta.glob` でビルド時にMarkdownファイルを収集
  2. gray-matter で Front Matter を解析
  3. marked で Markdown 本文を HTML に変換
  4. React コンポーネントで `dangerouslySetInnerHTML` により本文を描画
- セキュリティ：入力元は管理者作成の Markdown のみ。ユーザー入力は受け付けない
- 例外処理：記事未存在時は 404 相当の表示（要実装）

#### 2.2.2 記事一覧表示

- 概要：カテゴリ別に記事を新着順で一覧表示する
- 入力：該当カテゴリ（blog / study / analysis / predict）配下の Markdown 一覧
- 出力：一覧画面
- 処理内容：
  1. Front Matter の `date` を取得
  2. 日付の降順でソート
  3. カード形式でタイトル・日付・サムネイルを表示
  4. カードクリックで記事詳細へ遷移

#### 2.2.3 カテゴリ・タグ管理

- 概要：Front Matter により記事を分類する
- 入力：Front Matter の `category` / `tags`
- 出力：一覧・詳細画面での分類表示、将来のフィルタ拡張
- 処理内容：
  - `category`：`blog` / `study` / `analysis` / `predict` で記事のルート（/blog / /study / /analysis / /predict）を決定
  - `tags`：文字列配列。記事詳細・一覧で表示。タグ別一覧は将来拡張
- 設計方針：DBを使わずファイルベースで拡張可能とする

#### 2.2.4 OGP表示

- 概要：SNS共有時に適切なメタ情報を出力する
- 入力：Front Matter（title, description, ogImage 等）、現在URL
- 出力：HTML `<head>` 内のメタタグ
- 処理内容：
  - 全ページで以下を設定：`og:title`, `og:description`, `og:type`, `og:url`, `og:image`, `og:site_name`
  - Twitter Card：`summary_large_image` 形式
  - `ogImage` 未設定時はサイト共通のデフォルト画像を使用
  - 記事ページは `og:type` を `article`、一覧・ホームは `website` とする
- 実装：react-helmet-async 等でページ単位に head を制御

#### 2.2.5 広告表示

- 概要：Google Ads をサイト内に表示する
- 入力：Google Ads 発行の広告ユニットコード
- 出力：固定サイズの広告表示領域
- 処理内容：
  - 記事詳細・一覧等の所定位置に広告コンポーネントを配置
  - 広告読み込み前にプレースホルダ領域を確保し CLS を抑制
  - 外部スクリプトは Google 公式のもののみ利用
- 例外処理：広告ブロック環境では表示されない（許容）

<div style="page-break-after: always;"></div>

## 3. コンポーネント設計

### 3.1 コンポーネント一覧

| コンポーネント | 責務                         | 関連画面・機能        |
| -------------- | ---------------------------- | --------------------- |
| Header         | ロゴ・ハンバーガー（SideNav 開閉） | 全画面           |
| SideNav        | ドロワー型グローバルナビ     | 全画面                |
| Footer         | フッター・コピーライト       | 全画面                |
| Home           | トップページ                 | ホーム                |
| BlogList       | ブログ記事一覧               | ブログ一覧、記事一覧表示 |
| StudyList      | 研究記事一覧                 | 競馬研究一覧、記事一覧表示 |
| AnalysisList   | レース分析記事一覧           | レース分析一覧、記事一覧表示 |
| PredictList    | レース予想記事一覧           | レース予想一覧、記事一覧表示 |
| BlogPost       | ブログ記事詳細               | ブログ記事、記事表示、OGP表示 |
| StudyPost      | 研究記事詳細                 | 競馬研究記事、記事表示、OGP表示 |
| AnalysisPost   | レース分析記事詳細           | レース分析記事、記事表示、OGP表示 |
| PredictPost    | レース予想記事詳細           | レース予想記事、記事表示、OGP表示 |
| Profile        | プロフィール                 | プロフィール          |
| BlogCard       | 一覧用記事カード             | 各記事一覧            |
| Breadcrumb     | パンくずリスト               | 記事詳細、SEO         |
| MetaTags       | title / description / OGP  | 全画面、OGP表示       |
| AdUnit         | Google Ads 表示              | 所定画面、広告表示    |
| markdown（utils） | Markdown読込・変換・ソート | 記事表示、記事一覧表示、カテゴリ・タグ管理 |

### 3.2 ルーティング

ルーティング（`App.tsx`）：

| path                  | コンポーネント |
| --------------------- | -------------- |
| /                     | Home           |
| /blog                 | BlogList       |
| /blog/:article_name   | BlogPost       |
| /study                | StudyList      |
| /study/:article_name  | StudyPost      |
| /analysis             | AnalysisList   |
| /analysis/:article_name | AnalysisPost |
| /predict              | PredictList    |
| /predict/:article_name | PredictPost   |
| /profile              | Profile        |

<div style="page-break-after: always;"></div>

## 4. 変更履歴

| 日付       | 版  | 内容                                       | 担当   |
| ---------- | --- | ------------------------------------------ | ------ |
| 2026-02-02 | 1.0 | 初版作成（設計書 機能・コンポーネントとして） | βshort |
| 2026-05-23 | 1.1 | 仕様書に基づき更新                         | βshort |
| 2026-05-23 | 1.3 | レース分析・レース予想のコンポーネント・ルーティングを追加 | βshort |
| 2026-08-10 | 2.0 | design.md から機能コンポーネント設計書として分割 | βshort |
| 2026-08-10 | 2.1 | Header をロゴ＋ハンバーガー、SideNav を追加 | βshort |
