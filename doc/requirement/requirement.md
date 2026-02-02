# 要件定義

1. [概要](#概要)
2. [システム](#システム)
3. [ページ](#ページ)

## 概要

* 競馬ブログサイト
  * ブログ記事
  * 競馬系の勉強記事

## システム

* スマホ用設計
* デプロイ先は、Xserver
* React
  * Vite
  * TypeScript
  * Tailwind CSS
  * dangerouslySetInnerHTML
* Google Adsで広告を表示する
* 記事はmarkdownで作成する
  * ビルド時に、markdownをHTMLに変換する。
  * ブログ記事一覧ページには、変換したHTMLの一覧を表示する。
  * ブログ記事ページで、変換したHTMLを表示する。
* OGP対応
* Twitter Card
* パンくずリスト

## ページ

* ホームページ
  * ページのURLは、baseURL
  * ヘッダー
    * タイトルを表示する
    * メニューを表示する
      * ホーム
      * ブログ
      * 研究
    * ハンバーガーメニューを表示する
      * 右側に表示する
  * フッター
    * クレジットを表示する
      * βshort
* ブログページ
  * ブログ記事
  * ブログ記事一覧ページのURLは、baseURL/blog
  * 各ブログ記事ページのURLは、baseURL/blog/article_name
* 研究ページ
  * 研究記事
  * ブログ記事一覧ページのURLは、baseURL/study
  * 各ブログ記事ページのURLは、baseURL/study/article_name
  * カテゴリとタグで管理できる
* 共通コンポーネント
  * ブログ/研究ページは、ブログ記事一覧を表示する。
    * 新着順に表示する。
      * スライドショーで記事を表示する
    * おすすめ記事を表示する。
      * スライドショーで記事を表示する
