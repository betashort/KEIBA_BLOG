# UI設計（個別画面）

上位文書: [画面設計書](../screen_design.md)  
関連文書: [機能コンポーネント設計書](../component_design.md) / [アーキテクチャ設計書](../architecture_design.md)

## 目的

[画面設計書](../screen_design.md) の「3. 画面詳細」は URL・概要・表示項目の粒度とする。  
レイアウト構成・UI要素・状態・レスポンシブ・ワイヤー参照など、実装に必要な詳細は本ディレクトリに画面単位で記載する。

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

## 各文書の記載方針

各画面ファイルは次の構成を基本とする（画面により省略可）。

1. 基本情報（URL・対応コンポーネント・画面設計書へのリンク）
2. レイアウト構成
3. UI要素一覧
4. インタラクション
5. 表示状態（通常 / 空 / 未存在 等）
6. レスポンシブ
7. ワイヤー・モック参照
8. 未決事項
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
| `profile/` | `AboutMe.drawio` |

## 変更履歴

| 日付 | 版 | 内容 | 担当 |
| ---- | -- | ---- | ---- |
| 2026-08-10 | 1.0 | 個別画面 UI 設計ドキュメントを新設 | βshort |
| 2026-08-10 | 1.1 | 既存 drawio/png を各画面フォルダへ移動 | βshort |
