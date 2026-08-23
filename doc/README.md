# ドキュメント一覧

## マニュアル

運用手順（開発者向け）。

* [マニュアル一覧](manual/README.md)
* [デプロイ（Xserver）](manual/deploy.md)
* [愛馬日記の写真書き出し](manual/hitokuchi-photos.md)

## 用語集

### ドキュメント

| ドキュメント              | 目的                                               | 対象者        |
| ------------------------- | -------------------------------------------------- | ------------- |
| 要求仕様書(Requirement)   | 依頼者が依頼したい要求を整理する                   | 依頼者→開発者 |
| 要件定義書(Specification) | 開発者が依頼者の要求を実現するための機能を整理する | 開発者→依頼者 |
| 設計書(Design)            | 開発者が要件を実装するための方法を整理する         | 開発者→開発者 |
| 詳細設計書(Detailed Design) | 実装済みモジュール・処理の詳細を整理する         | 開発者→開発者 |

## 要求仕様書

* 要求
* 理由
* 仕様

## 要件定義書

* 要求仕様
* 要求を実現するための機能

## 設計書

* 機能
* どう作るか

* [設計書（索引）](03_design/design.md)
* [アーキテクチャ設計書](03_design/architecture_design.md)
* [画面設計書](03_design/screen_design.md)
* [機能コンポーネント設計書](03_design/component_design.md)

## デザインイメージカタログ

記事カテゴリごとの一覧サムネイル・OGP の見た目仕様。

* [カタログ索引](design-image-catalog/README.md)
* [共通仕様](design-image-catalog/common.md)
* [素材一覧](design-image-catalog/assets/README.md)
* [サムネ生成プロンプト（ComfyUI / SD WebUI）](design-image-catalog/prompts.md)

## サイトエンブレム／アイコン

サイト識別マークと作者アイコン。実装の差し込みは別作業。

* [索引](design-emblem/README.md)
* [作者アイコン](design-emblem/author-icon.md)（現行 `favicon.ico` / X）
* [サイトエンブレム](design-emblem/emblem.md)
* [生成プロンプト（ComfyUI / SD WebUI）](design-emblem/prompts.md)
* [用途とサイズ](design-emblem/usage.md)

## 詳細設計書

* 実装したモジュール・ファイル・処理フロー
* 基本設計との差分

* [詳細設計書](04_detailed_design/detailed_design.md)
