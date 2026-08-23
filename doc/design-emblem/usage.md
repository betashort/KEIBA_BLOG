# 用途とサイズ

上位文書: [索引](./README.md)  
形と色は [emblem.md](./emblem.md) / [author-icon.md](./author-icon.md)。

## 1. 適用一覧

| 用途 | 資産 | 表示サイズの目安 | 書き出し | 現状 |
| ---- | ---- | ---------------- | -------- | ---- |
| ブラウザ favicon | エンブレム | 16 / 32 | `favicon.ico` + `favicon.svg` | 作者アイコンが入っている |
| Apple タッチ | エンブレム（バッジ） | 180×180 | `/apple-touch-icon.png` | なし |
| Header | エンブレム＋ワードマーク | マーク 28–32px | インライン SVG を推奨 | テキストのみ |
| プロフィール顔 | 作者アイコン | 128–256 | `/images/author/icon.png` | 未実装 |
| X プロフィール | 作者アイコン | 400×400 推奨 | SNS 側にアップロード | `favicon.ico` を流用 |
| PWA | エンブレム（バッジ） | 192 / 512 | マニフェスト用 PNG | PWA 未導入 |
| 記事 OGP / 一覧サムネ | 使わない（またはラベルに小さく） | 1200×630 | カタログ側 | [design-image-catalog](../design-image-catalog/README.md) |

OGP の主役はカテゴリ色と記事タイトルである。エンブレムを全面にしない。スロット A の「競馬βLab」の左に 24px 相当で置いてよいが、必須ではない。

## 2. favicon セット（移行後）

`index.html` は現状 `href="/favicon.ico"` のみ。差し替え時のセット:

| ファイル | 内容 |
| -------- | ---- |
| `/favicon.svg` | ライト版マスター。モダンブラウザ |
| `/favicon.ico` | 16・32・48 を内包。レガシー。**作者アイコンを入れない** |
| `/apple-touch-icon.png` | 180×180、バッジ版、背景を塗りつぶす（透過は黒い背景になる端末がある） |

ICO の容量は数十 KB に収める。現行 428 KB は写真 ICO のためで、移行後の目標にしない。

## 3. 本番パス（予定）

実装時にこの表へ実ファイルを置く。本仕様の初版ではパスだけ決める。

```
/favicon.svg
/favicon.ico
/apple-touch-icon.png
/images/brand/emblem.svg
/images/brand/emblem-dark.svg
/images/author/icon.png
```

仕様側:

```
doc/design-emblem/prompts.md                 … 生成プロンプト
doc/design-emblem/assets/                    … ラフ PNG（未作成）
doc/design-emblem/assets/author-icon-current.png
```

## 4. Header への入れ方

`Header` のサイト名リンク（`SITE_NAME`）の左にエンブレムを置く。マークだけを独立したリンクにしない。

- ライト版、ink on paper
- `aria-hidden` でマークを隠し、リンクテキスト「競馬βLab」を残す（あるいはマークに `alt=""` 相当）
- ハンバーガーとの関係は変えない

## 5. やってはいけないこと

- 作者アイコンを `apple-touch-icon` にする（ホーム画面が人物画になる）
- OGP 全面をエンブレムにする（サムネカタログと役割が被る）
- カテゴリごとにエンブレムの色を変える
- SVG と PNG で字形を別デザインにする

## 6. 変更履歴

| 日付 | 版 | 内容 | 担当 |
| ---- | -- | ---- | ---- |
| 2026-08-23 | 1.2 | 寸法 SVG のパスを削除。生成は prompts.md | βshort |
| 2026-08-23 | 1.1 | エンブレム構成変更に合わせ、完成判定は [emblem.md](./emblem.md) に委譲 | βshort |
| 2026-08-23 | 1.0 | 初版 | βshort |
