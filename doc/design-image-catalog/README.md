# デザインイメージカタログ（サムネイル）

上位文書: [ドキュメント一覧](../README.md)  
関連: [OGP](../reference/OGP.md) / [UI設計（個別画面）](../03_design/UI_design/README.md) / [アーキテクチャ設計書 §4.2 Front Matter](../03_design/architecture_design.md)

記事カテゴリ（`keiba-blog/src/articles/`）ごとに、一覧サムネイルと OGP 画像の見た目を揃えるための仕様である。  
実装の差し込み（Front Matter へのパス設定）は別作業とし、本書はデザインの基準だけを定める。

## 1. 対象カテゴリ

`src/articles/` 直下の公開カテゴリ。`template/` は対象外。

| フォルダ | 表示名 | 記事の単位 | 仕様 |
| -------- | ------ | ---------- | ---- |
| `blog/` | ブログ | 記事（`{slug}/index.md`） | [blog.md](./blog.md) |
| `study/` | 競馬研究 | 記事 | [study.md](./study.md) |
| `analysis/` | レース分析 | レース記事 | [analysis.md](./analysis.md) |
| `predict/` | レース予想 | 注目レース記事（開催日インデックスは対象外） | [predict.md](./predict.md) |
| `hitokuchi/` | 一口馬主 | 馬ごと（愛馬日記）。日記ファイルは個別 URL なし | [hitokuchi.md](./hitokuchi.md) |
| `baken/` | 馬券成績 | 月次記事（`{YYYY-MM}/index.md`） | [baken.md](./baken.md) |

共通ルールは [common.md](./common.md)。

## 2. 一覧

縮小してもカテゴリ色とモチーフで区別できること。タイトルは OGP・カード本文側でも出る。  
モチーフ素材は [assets](./assets/) に置く。完成サムネはテンプレートへ配置してから書き出す。

一覧ページ自体の OGP（記事ではなく `/blog` など）は、各仕様の「カテゴリ既定」を使う。一口馬主・馬券のポートフォリオ画面は記事フォルダ外だが、同じ色系統でページ用イメージを用意する（各仕様を参照）。

## 3. 方針（要約）

1. **実写写真を主役にしない。** クラブ公式写真・馬体写真は著作権と欠番（未登録馬）で崩れる。タイポ＋単色モチーフを基本とする。
2. **カテゴリは背景色で識別する。** 一覧カード（約 112×80）ではタイトルが読めない。色とモチーフが先、文字は後。
3. **1枚のマスター（1200×630）を一覧と OGP で共用する。** `thumbnail` と `ogImage` に同じパスを書いてよい。
4. **サイトの既存ルールに合わせる。** 牡馬は青・牝馬は赤。サイト名は「競馬βLab」。白地の本文 UI とは別に、サムネだけ一段暗い。

詳細は [common.md](./common.md)。  
背景・モチーフを ComfyUI / Stable Diffusion WebUI で作るときのプロンプトは [prompts.md](./prompts.md)。素材単体は [assets](./assets/)。

## 4. 資産の置き場

| 種類 | 場所 |
| ---- | ---- |
| モチーフ素材 | `doc/design-image-catalog/assets/`（[assets/README.md](./assets/README.md)） |
| レイアウトグリッド | `doc/design-image-catalog/assets/common-grid.svg` |
| 本番画像（書き出し後） | `keiba-blog/public/images/og/{category}/` |

本番ファイル名の例:

```
/images/og/blog/default.png
/images/og/blog/howtobet-baken.png
/images/og/hitokuchi/flashing-ruby.png
/images/og/baken/2025-08.png
```

## 5. 変更履歴

| 日付 | 版 | 内容 | 担当 |
| ---- | -- | ---- | ---- |
| 2026-08-23 | 1.3 | 素材ごとのプロンプト md を追加 | βshort |
| 2026-08-23 | 1.2 | assets を素材置き場に変更。記事モック SVG を削除 | βshort |
| 2026-08-23 | 1.1 | ComfyUI / SD WebUI 向けプロンプト（prompts.md）を追加 | βshort |
| 2026-08-23 | 1.0 | 初版。6カテゴリのデザインイメージ仕様を追加 | βshort |
