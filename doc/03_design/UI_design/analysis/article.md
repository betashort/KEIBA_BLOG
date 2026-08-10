# UI設計：レース分析記事

上位文書: [画面設計書 §3.4](../../screen_design.md#34-レース分析一覧記事) / [本ディレクトリ README](../README.md)  
共通: [common.md](../common.md)  
関連: [一覧](./list.md)  
ベース: 説明・表示項目は [ブログ記事](../blog/article.md) と同様。パンくずの親を「レース分析」とする

## 1. 基本情報

| 項目 | 内容 |
| ---- | ---- |
| URL | `/analysis/{article_name}` |
| 説明 | Markdown から変換されたレース分析記事を表示 |
| 対応コンポーネント | `AnalysisPost` / `Breadcrumb` / `MetaTags` / `AdUnit` |
| データ | `src/articles/analysis/{article_name}/index.md` |
| og:type | `article` |

## 2. レイアウト構成

ブログ記事と同様

## 3. UI要素一覧

| 項目 | 説明 |
| ---- | ---- |
| パンくずリスト | ホーム > レース分析 > 記事タイトル |
| タイトル（h1） | 記事タイトル（1ページ1つのみ） |
| 公開日 | Front Matter の `date` |
| カテゴリ | 記事カテゴリ |
| タグ | 記事タグ（複数可） |
| 本文 | Markdown 変換 HTML |
| OGP画像 | 記事ごと（未設定時はデフォルト） |
| 広告 | Google Ads（レイアウト固定領域） |

## 4. インタラクション

- パンくず「ホーム」→ `/`
- パンくず「レース分析」→ `/analysis`

## 5. 表示状態 / 6. レスポンシブ

ブログ記事と同様

## 7. ワイヤー・モック参照

| 資産 | パス | 備考 |
| ---- | ---- | ---- |
| drawio | [RaceDetail.drawio](./RaceDetail.drawio) | 旧詳細系。PNG 未書き出し。予想記事からも参照 |
| drawio | [PastRaceDetail.drawio](./PastRaceDetail.drawio) | 空ファイル。要確認・削除候補 |

## 8. 未決事項

- [ ] レース分析固有の表・結果サマリ UI の要否（現状は汎用 Markdown 表示）

## 9. 変更履歴

| 日付 | 版 | 内容 | 担当 |
| ---- | -- | ---- | ---- |
| 2026-08-10 | 1.0 | 初版 | βshort |
