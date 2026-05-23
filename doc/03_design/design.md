# ソフトウェア設計書（競馬ブログ）

1. [1. はじめに](#1-はじめに)
   1. [1.1 目的](#11-目的)
   2. [1.2 対象読者](#12-対象読者)
   3. [1.3 用語・略語](#13-用語略語)
2. [2. システム概要](#2-システム概要)
   1. [2.1 システムの位置づけ](#21-システムの位置づけ)
   2. [2.2 システム構成図](#22-システム構成図)
   3. [2.3 処理概要](#23-処理概要)
3. [3. 設計方針](#3-設計方針)
   1. [3.1 設計方針](#31-設計方針)
   2. [3.2 使用技術](#32-使用技術)
   3. [3.3 命名規則](#33-命名規則)
4. [4. 画面設計（UI設計）](#4-画面設計ui設計)
   1. [4.1 画面一覧](#41-画面一覧)
   2. [4.2 画面詳細](#42-画面詳細)
      1. [4.2.1 ホーム](#421-ホーム)
      2. [4.2.2 ブログ一覧・記事](#422-ブログ一覧記事)
      3. [4.2.3 競馬研究一覧・記事](#423-競馬研究一覧記事)
      4. [4.2.4 レース分析一覧・記事](#424-レース分析一覧記事)
      5. [4.2.5 レース予想一覧・記事](#425-レース予想一覧記事)
      6. [4.2.6 プロフィール](#426-プロフィール)
5. [5. 機能設計（処理設計）](#5-機能設計処理設計)
   1. [5.1 機能一覧](#51-機能一覧)
   2. [5.2 機能詳細](#52-機能詳細)
      1. [5.2.1 記事表示](#521-記事表示)
      2. [5.2.2 記事一覧表示](#522-記事一覧表示)
      3. [5.2.3 カテゴリ・タグ管理](#523-カテゴリタグ管理)
      4. [5.2.4 OGP表示](#524-ogp表示)
      5. [5.2.5 広告表示](#525-広告表示)
6. [6. コンポーネント設計](#6-コンポーネント設計)
7. [7. データ設計](#7-データ設計)
   1. [7.1 データ管理方針](#71-データ管理方針)
   2. [7.2 Front Matter定義](#72-front-matter定義)
   3. [7.3 フォルダ構成](#73-フォルダ構成)
8. [8. API設計](#8-api設計)
9. [9. 非機能設計](#9-非機能設計)
   1. [9.1 性能](#91-性能)
   2. [9.2 可用性](#92-可用性)
   3. [9.3 セキュリティ](#93-セキュリティ)
   4. [9.4 保守性・拡張性](#94-保守性拡張性)
   5. [9.5 SEO](#95-seo)
   6. [9.6 OGP・SNS連携](#96-ogpsns連携)
   7. [9.7 広告・クローラ対応](#97-広告クローラ対応)
10. [10. テスト観点（設計レベル）](#10-テスト観点設計レベル)
    1. [10.1 単体テスト観点](#101-単体テスト観点)
    2. [10.2 結合テスト観点](#102-結合テスト観点)
11. [11. デプロイ設計](#11-デプロイ設計)
    1. [11.1 デプロイ先](#111-デプロイ先)
    2. [11.2 ビルド・デプロイ手順](#112-ビルドデプロイ手順)
    3. [11.3 サーバー設定](#113-サーバー設定)
12. [12. 変更履歴](#12-変更履歴)

<div style="page-break-after: always;"></div>

## 1. はじめに

### 1.1 目的

本書は、競馬ブログシステムのソフトウェア設計内容を明確にし、  
開発・テスト・保守を円滑に進めることを目的とする。

### 1.2 対象読者

- 開発者
- テスター
- プロジェクト管理者
- 保守担当者

### 1.3 用語・略語

| 用語         | 説明                                   |
| ------------ | -------------------------------------- |
| Markdown     | 記事作成に使用する軽量マークアップ言語 |
| OGP          | SNS共有時に表示されるメタ情報          |
| Twitter Card | X（旧Twitter）用OGP拡張                |
| Front Matter | Markdown先頭のYAML形式メタ情報         |
| LCP          | Largest Contentful Paint（最大コンテンツ描画時間） |
| CLS          | Cumulative Layout Shift（累積レイアウトシフト） |

<div style="page-break-after: always;"></div>

## 2. システム概要

### 2.1 システムの位置づけ

- 個人運営の競馬ブログサイト
- Webブラウザから閲覧する情報提供サイト
- 静的ビルドを前提とし、DB・CMS・ユーザー投稿機能は持たない

### 2.2 システム構成図

```
[管理者]
   │ Markdown作成・編集
   ▼
[開発環境]
   React + Vite + TypeScript
   │ npm run build
   ▼
[静的ファイル（HTML/CSS/JS/画像）]
   │ FTP等でアップロード
   ▼
[Xserver（公開Webサーバー）]
   │
   ▼
[一般閲覧者（スマートフォン / PC ブラウザ）]
```

外部連携：

- Google Ads：埋め込みスクリプトによる広告表示

### 2.3 処理概要

- Markdownで記事を作成
- ビルド時にMarkdownをHTMLへ変換
- 変換したHTMLを記事ページ・一覧ページに表示
- 静的ファイルとしてXserverへデプロイ

<div style="page-break-after: always;"></div>

## 3. 設計方針

### 3.1 設計方針

- スマートフォン閲覧を前提としたモバイルファースト設計
- 静的ビルドによる高速表示・24時間閲覧可能な構成
- 記事はMarkdownファイルで管理し、追加・修正が容易な構成
- カテゴリ・タグは拡張可能なFront Matter設計
- SEO・OGPを記事単位で管理可能とする
- 障害時は再ビルド・再デプロイで復旧可能とする

### 3.2 使用技術

| 区分           | 技術            |
| -------------- | --------------- |
| フロントエンド | React           |
| ビルドツール   | Vite            |
| 言語           | TypeScript      |
| UI             | Tailwind CSS    |
| ルーティング   | react-router-dom |
| 記事管理       | Markdown        |
| Front Matter解析 | gray-matter   |
| Markdown変換   | marked          |
| メタ情報       | react-helmet-async（想定） |
| デプロイ先     | Xserver         |

### 3.3 命名規則

| 対象             | 規則        | 例              |
| ---------------- | ----------- | --------------- |
| Reactコンポーネント | PascalCase | `BlogPost.tsx`  |
| ファイル名（コンポーネント以外） | camelCase | `markdown.ts`   |
| 記事フォルダ名   | kebab-case  | `howtobet-baken` |
| URLスラッグ      | kebab-case  | `/blog/howtobet-baken` |

<div style="page-break-after: always;"></div>

## 4. 画面設計（UI設計）

### 4.1 画面一覧

| 画面名       | URL                    | 概要                     |
| ------------ | ---------------------- | ------------------------ |
| ホーム       | /                      | トップページ             |
| ブログ一覧   | /blog                  | ブログ記事一覧（新着順） |
| ブログ記事   | /blog/{article_name}   | ブログ記事詳細           |
| 競馬研究一覧 | /study                 | 研究記事一覧（新着順）   |
| 競馬研究記事 | /study/{article_name}  | 研究記事詳細             |
| レース分析一覧 | /analysis            | レース分析記事一覧（新着順） |
| レース分析記事 | /analysis/{article_name} | レース分析記事詳細   |
| レース予想一覧 | /predict             | レース予想記事一覧（新着順） |
| レース予想記事 | /predict/{article_name} | レース予想記事詳細   |
| プロフィール | /profile               | 自己紹介                 |

共通レイアウト：Header（ナビゲーション）＋ メインコンテンツ ＋ Footer

### 4.2 画面詳細

#### 4.2.1 ホーム

- URL：/
- 説明：サイトトップ。各セクションへの導線を表示
- 表示項目：サイトタイトル、ブログ・研究・レース分析・レース予想へのリンク、プロフィールへのリンク

#### 4.2.2 ブログ一覧・記事

**ブログ一覧**

- URL：/blog
- 説明：ブログカテゴリの記事を新着順で一覧表示
- 表示項目：サムネイル、タイトル、公開日、カテゴリ、タグ（任意）

**ブログ記事**

- URL：/blog/{article_name}
- 説明：Markdownから変換された記事を表示
- 表示項目：

| 項目           | 説明                         |
| -------------- | ---------------------------- |
| パンくずリスト | ホーム > ブログ > 記事タイトル |
| タイトル（h1） | 記事タイトル（1ページ1つのみ） |
| 公開日         | Front Matterの date          |
| カテゴリ       | 記事カテゴリ                 |
| タグ           | 記事タグ（複数可）           |
| 本文           | Markdown変換HTML             |
| OGP画像        | 記事ごとに設定（未設定時はデフォルト） |
| 広告           | Google Ads（レイアウト固定領域） |

#### 4.2.3 競馬研究一覧・記事

**競馬研究一覧**

- URL：/study
- 説明：研究カテゴリの記事を新着順で一覧表示
- 表示項目：ブログ一覧と同様

**競馬研究記事**

- URL：/study/{article_name}
- 説明・表示項目：ブログ記事と同様。パンくずの親を「競馬研究」とする

#### 4.2.4 レース分析一覧・記事

**レース分析一覧**

- URL：/analysis
- 説明：レース分析カテゴリの記事を新着順で一覧表示
- 表示項目：ブログ一覧と同様

**レース分析記事**

- URL：/analysis/{article_name}
- 説明・表示項目：ブログ記事と同様。パンくずの親を「レース分析」とする

#### 4.2.5 レース予想一覧・記事

**レース予想一覧**

- URL：/predict
- 説明：レース予想カテゴリの記事を新着順で一覧表示
- 表示項目：ブログ一覧と同様

**レース予想記事**

- URL：/predict/{article_name}
- 説明・表示項目：ブログ記事と同様。パンくずの親を「レース予想」とする

#### 4.2.6 プロフィール

- URL：/profile
- 説明：運営者の自己紹介を表示
- 表示項目：プロフィール本文、サイト概要

<div style="page-break-after: always;"></div>

## 5. 機能設計（処理設計）

### 5.1 機能一覧

| 機能名             | 概要                           |
| ------------------ | ------------------------------ |
| 記事表示           | Markdownから変換したHTMLを表示 |
| 記事一覧表示       | 新着順で記事一覧を表示         |
| カテゴリ・タグ管理 | 記事を分類して管理             |
| OGP表示            | SNS共有時のOGP対応             |
| 広告表示           | Google Adsを表示               |

### 5.2 機能詳細

#### 5.2.1 記事表示

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

#### 5.2.2 記事一覧表示

- 概要：カテゴリ別に記事を新着順で一覧表示する
- 入力：該当カテゴリ（blog / study / analysis / predict）配下の Markdown 一覧
- 出力：一覧画面
- 処理内容：
  1. Front Matter の `date` を取得
  2. 日付の降順でソート
  3. カード形式でタイトル・日付・サムネイルを表示
  4. カードクリックで記事詳細へ遷移

#### 5.2.3 カテゴリ・タグ管理

- 概要：Front Matter により記事を分類する
- 入力：Front Matter の `category` / `tags`
- 出力：一覧・詳細画面での分類表示、将来のフィルタ拡張
- 処理内容：
  - `category`：`blog` / `study` / `analysis` / `predict` で記事のルート（/blog / /study / /analysis / /predict）を決定
  - `tags`：文字列配列。記事詳細・一覧で表示。タグ別一覧は将来拡張
- 設計方針：DBを使わずファイルベースで拡張可能とする

#### 5.2.4 OGP表示

- 概要：SNS共有時に適切なメタ情報を出力する
- 入力：Front Matter（title, description, ogImage 等）、現在URL
- 出力：HTML `<head>` 内のメタタグ
- 処理内容：
  - 全ページで以下を設定：`og:title`, `og:description`, `og:type`, `og:url`, `og:image`, `og:site_name`
  - Twitter Card：`summary_large_image` 形式
  - `ogImage` 未設定時はサイト共通のデフォルト画像を使用
  - 記事ページは `og:type` を `article`、一覧・ホームは `website` とする
- 実装：react-helmet-async 等でページ単位に head を制御

#### 5.2.5 広告表示

- 概要：Google Ads をサイト内に表示する
- 入力：Google Ads 発行の広告ユニットコード
- 出力：固定サイズの広告表示領域
- 処理内容：
  - 記事詳細・一覧等の所定位置に広告コンポーネントを配置
  - 広告読み込み前にプレースホルダ領域を確保し CLS を抑制
  - 外部スクリプトは Google 公式のもののみ利用
- 例外処理：広告ブロック環境では表示されない（許容）

<div style="page-break-after: always;"></div>

## 6. コンポーネント設計

| コンポーネント | 責務                         | 関連画面・機能        |
| -------------- | ---------------------------- | --------------------- |
| Header         | グローバルナビゲーション     | 全画面                |
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

## 7. データ設計

※本システムはDBを使用しない

### 7.1 データ管理方針

- 記事データは Markdown ファイルで管理
- 画像は記事フォルダ配下または `public/images/` に配置
- ビルド時にファイルを読み込み、ランタイムでは静的データとして扱う

### 7.2 Front Matter定義

```yaml
---
title: "記事タイトル"           # 必須。ページh1・og:titleに使用
date: "2025-07-16"              # 必須。一覧のソート・表示に使用
description: "記事の要約"       # 推奨。meta description・og:descriptionに使用
category: "blog"                # 必須。blog | study | analysis | predict
tags: ["競馬", "予想"]          # 任意。配列
thumbnail: "/images/.../thumb.jpg"  # 任意。一覧サムネイル
ogImage: "/images/.../og.jpg"       # 任意。未設定時はデフォルトOGP画像
noindex: false                  # 任意。将来拡張：trueでnoindex
---
```

### 7.3 フォルダ構成

```txt
keiba-blog/
├─ public/
│  ├─ images/              # 記事画像・OGPデフォルト画像
│  ├─ robots.txt
│  └─ ...
├─ src/
│  ├─ articles/
│  │  ├─ blog/
│  │  │  └─ {article_name}/
│  │  │     ├─ index.md
│  │  │     └─ hero.png    # 記事専用画像（任意）
│  │  ├─ study/
│  │  │  └─ {article_name}/
│  │  │     ├─ index.md
│  │  │     └─ hero.png
│  │  ├─ analysis/
│  │  │  └─ {article_name}/
│  │  │     ├─ index.md
│  │  │     └─ hero.png
│  │  └─ predict/
│  │     └─ {article_name}/
│  │        ├─ index.md
│  │        └─ hero.png
│  ├─ component/
│  ├─ pages/
│  ├─ utils/
│  │  └─ markdown.ts       # 読込・変換・ソート
│  ├─ App.tsx
│  └─ main.tsx
├─ dist/                   # ビルド成果物（デプロイ対象）
└─ vite.config.ts
```

<div style="page-break-after: always;"></div>

## 8. API設計

本システムではバックエンドAPIは使用しない。  
記事取得・変換はすべてビルド時／クライアント側の静的処理で完結する。

<div style="page-break-after: always;"></div>

## 9. 非機能設計

### 9.1 性能

| 項目     | 設計内容                                       |
| -------- | ---------------------------------------------- |
| LCP      | 2.5秒以内を目標。画像の適切なサイズ・形式を使用 |
| 初回表示 | Vite によるコード分割・静的配信で高速化         |
| 一覧表示 | モバイル環境での高速表示を優先                   |

### 9.2 可用性

- 静的サイトとして Xserver 上で 24 時間閲覧可能とする
- 障害時はソースから再ビルド・再デプロイで復旧
- ランタイムのサーバー処理に依存しない構成

### 9.3 セキュリティ

- コメント等のユーザー入力機能は提供しない
- `dangerouslySetInnerHTML` の入力元は管理者作成 Markdown のみ
- 外部スクリプトは Google Ads 等、信頼されたもののみ利用
- CMS・認証機能は対象外

### 9.4 保守性・拡張性

- 記事追加：Markdown ファイルを所定フォルダに配置するだけで反映可能
- カテゴリ・タグ：Front Matter の追加・変更で拡張
- SEO・OGP：記事単位の Front Matter で管理
- `noindex` / `nofollow`：Front Matter フラグで将来対応可能な設計

### 9.5 SEO

| 要件                     | 設計対応                                           |
| ------------------------ | -------------------------------------------------- |
| title / meta description | MetaTags コンポーネントでページ・記事単位に設定    |
| 見出し構造               | Markdown 内で h2〜h3 を論理階層に。h1 はタイトルのみ1つ |
| パンくずリスト           | Breadcrumb コンポーネントを記事ページに設置        |
| URL形式                  | `/blog/{article_name}`, `/study/{article_name}`, `/analysis/{article_name}`, `/predict/{article_name}` |
| モバイルファースト       | Tailwind CSS のレスポンシブ設計                    |
| noindex制御              | Front Matter `noindex`（将来実装）                 |
| sitemap.xml              | ビルド時または手動で生成し public に配置           |
| robots.txt               | public/robots.txt に配置                           |

### 9.6 OGP・SNS連携

| タグ / 要件              | 設計対応                              |
| ------------------------ | ------------------------------------- |
| og:title                 | 記事 title / サイト名                 |
| og:description           | 記事 description / サイト説明         |
| og:type                  | article（記事）/ website（その他）    |
| og:url                   | 現在ページの絶対URL                   |
| og:image                 | ogImage またはデフォルト画像の絶対URL |
| og:site_name             | サイト固定名                          |
| Twitter Card             | summary_large_image                   |

### 9.7 広告・クローラ対応

- Google Ads：AdUnit コンポーネントで所定位置に埋め込み
- CLS抑制：広告枠に min-height を指定し読み込み前のレイアウトを固定
- robots.txt：`public/robots.txt`
- sitemap.xml：全公開URLを列挙（ビルドスクリプトまたは手動更新）

<div style="page-break-after: always;"></div>

## 10. テスト観点（設計レベル）

### 10.1 単体テスト観点

- Markdown → HTML 変換結果（見出し・リンク・コードブロック）
- Front Matter 解析（必須項目欠落時のフォールバック）
- 日付ソート（新着順）の正しさ
- URLスラッグと記事フォルダ名の対応

### 10.2 結合テスト観点

- 記事一覧 → 記事詳細への遷移（/blog, /study, /analysis, /predict）
- SEO：title / meta description が記事ごとにユニークであること
- OGP・Twitter Card タグが記事・一覧・ホームで正しく出力されること
- パンくずリストの階層が正しいこと
- h1 が各ページに1つのみであること
- 広告表示領域のレイアウトシフトが許容範囲内であること
- robots.txt / sitemap.xml が配信されること

**受入条件（仕様書より）**

- 記事一覧・記事ページが正しく表示されること
- SEO・OGP設定が反映されていること

<div style="page-break-after: always;"></div>

## 11. デプロイ設計

### 11.1 デプロイ先

- Xserver（静的ファイルホスティング）

### 11.2 ビルド・デプロイ手順

1. `npm run build` で `dist/` を生成
2. `dist/` 配下を Xserver の公開ディレクトリへアップロード
3. `robots.txt` / `sitemap.xml` / 画像が含まれることを確認
4. ブラウザで主要ページの表示・OGPを確認

### 11.3 サーバー設定

SPA ルーティング用 `.htaccess`（Xserver / Apache）：

```txt
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

<div style="page-break-after: always;"></div>

## 12. 変更履歴

| 日付       | 版  | 内容                                       | 担当   |
| ---------- | --- | ------------------------------------------ | ------ |
| 2026-02-02 | 1.0 | 初版作成                                   | βshort |
| 2026-05-23 | 1.1 | 仕様書（specification.md）に基づき全体を更新 | βshort |
| 2026-05-23 | 1.2 | 関連ドキュメント・各種ID・優先度・トレーサビリティを削除 | βshort |
| 2026-05-23 | 1.3 | レース分析・レース予想の画面・ルーティング・データ設計を追加 | βshort |
