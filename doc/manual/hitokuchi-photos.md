# 愛馬日記の写真書き出し

愛馬日記のスライドショー用に、馬の写真を用意する手順。表示コンポーネントは画像を変換しないため、**置く前にサイズと容量を揃える**。

画面上の置き場所は [愛馬日記 UI 設計](../03_design/UI_design/profile/aiba-diary.md) を参照する。Front Matter の形は [アーキテクチャ設計書 §4.2](../03_design/architecture_design.md#42-front-matter定義) を参照する。

## 1. どこに出るか

| 場所 | 元データ | 表示 |
| ---- | -------- | ---- |
| 紹介タブ先頭 | `{bamei}/index.md` の `photos` | 複数枚ならスライドショー |
| 日記タブ・各観戦記の見出し直後 | `{bamei}/{YYYY-MM-DD}-{slug}.md` の `photos` | 同上 |

スライドの枠は幅最大 576px、縦横比 **4:3**、`object-cover`（枠に合わせて端を切る）。16:9 や縦写真をそのまま置くと、頭や蹄が欠ける。

`src` 未設定の項目は、画像の代わりに `alt` のプレースホルダを出す。

## 2. 推奨スペック

| 項目 | 推奨 | 許容 | 避ける |
| ---- | ---- | ---- | ---- |
| アスペクト比 | **4:3 横** | 4:3 のみ | 16:9 / 3:2 / 縦 |
| 画素 | **1200 × 900** | 800×600 〜 1600×1200 | スマホ原寸（4000px 超） |
| 形式 | **JPEG**（`.jpg`） | WebP | PNG / HEIC / AVIF |
| 色空間 | **sRGB** | sRGB | Display P3 のまま |
| 品質 | JPEG 80〜85 | 75〜90 | 無圧縮・100 |
| 1枚の容量 | **150KB 以下** | 200KB 以下 | 300KB 超 |
| 向き | 横位置 | 横位置 | 縦位置 |

1200 × 900 は、表示幅 576px の Retina（約 2 倍）に足りる切りのよい 4:3 である。ビルドで縮小しないので、原寸のまま置かない。

## 3. 配置と命名

ファイルは `keiba-blog/public/images/hitokuchi/{bamei}/` に置く。`{bamei}` は記事フォルダ名（英名 kebab-case。URL の `{bamei}`）と一致させる。

```text
keiba-blog/public/images/hitokuchi/{bamei}/
  body.jpg                          # 紹介: 馬体
  paddock.jpg                       # 紹介: パドック
  portrait.jpg                      # 紹介: 顔（任意）
  {YYYY-MM-DD}-{slug}-{scene}.jpg   # 日記
```

日記の `{scene}` は次で揃える。

| scene | 意味 |
| ----- | ---- |
| `paddock` | パドック |
| `track` | 本馬場入場・返し馬 |
| `race` | レース中 |
| `win` | 優勝・口取り |
| `stable` | 厩舎・放牧 |

例（フラッシングルビー / `flashing-ruby`）:

```text
public/images/hitokuchi/flashing-ruby/body.jpg
public/images/hitokuchi/flashing-ruby/paddock.jpg
public/images/hitokuchi/flashing-ruby/2026-07-11-makedebut-paddock.jpg
public/images/hitokuchi/flashing-ruby/2026-07-11-makedebut-track.jpg
```

Front Matter の `src` はサイトルートからのパス（`public` は書かない）。

```yaml
photos:
  - alt: "フラッシングルビーの馬体"
    caption: "黒鹿毛の牝馬"
    src: "/images/hitokuchi/flashing-ruby/body.jpg"
```

- `alt`: 必須。馬名と場面を入れる
- `caption`: 任意。スライド下の説明。日付や馬名は画像に焼き込まない
- 配列の先頭が最初に出る写真。紹介タブでは、いちばん見せたい・軽い写真を先頭にする

## 4. 枚数

| 用途 | 目安 | 上限 |
| ---- | ---- | ---- |
| 紹介（`index.md`） | 2〜4 枚 | 6 枚 |
| 日記（1 エントリ） | 2〜4 枚 | 6 枚 |

自動切替は 5 秒。8 枚を超えると一周が長い。1 枚だけなら前後ボタンは出ず、静止画になる。

## 5. 構図

`object-cover` は端を切る。重要部分は中央に置く。

- **セーフエリア**: 画面中央 80% に馬体・顔・ゼッケンを入れる。端 10% 程度は切れてもよい
- **大きさ**: 馬が画面の 60〜80% を占める。広すぎると小さく、寄りすぎると欠ける
- **水平**: 地面・柵が傾いていないこと
- **文字なし**: 日付・馬名は `caption` で出す
- **露出**: パドックの逆光は顔が落ちやすい。顔が読める露出を優先

紹介と日記の役割例:

| 用途 | 内容の例 |
| ---- | -------- |
| 紹介 | 馬体、パドック、顔、放牧 |
| 日記 | パドック、本馬場、返し馬、レース後 |

## 6. 書き出し手順

ツールは問わない。4:3 クロップと 1200 × 900 リサイズができればよい。Windows 標準のペイントでの例を 6.2 に書く。

### 6.1 共通手順

1. 原寸（スマホ・一眼）を PC に取り込む。iPhone の **HEIC はそのまま使わない**（ブラウザが読めない）。JPEG または PNG に変換してから開く
2. 横位置であることを確認する。縦写真は 4:3 横にクロップできる構図だけ採用する
3. **4:3 横**でクロップする。馬を中央のセーフエリアに置く
4. **1200 × 900** にリサイズする（縦横比は固定したまま）
5. 色空間が選べる場合は **sRGB**
6. **JPEG**、品質 80〜85 で保存する。拡張子は `.jpg`
7. ファイルサイズを確認する。**150KB を超えたら** 品質を 75 まで下げる
8. `keiba-blog/public/images/hitokuchi/{bamei}/` に、§3 の名前で置く
9. 対応する Markdown の `photos` で `src` のコメントを外し、パスを実ファイル名に合わせる
10. 愛馬日記ページで、切れ・向き・キャプションを確認する

16:9（横に長い）→ 左右を切って 4:3 にする。3:2 も同様に左右を切る。すでに 4:3 ならクロップは最小限でよい。

### 6.2 Windows ペイント（例）

Windows 11 のペイントを使う場合:

1. エクスプローラーで写真を右クリック → **編集**（またはペイントで開く）
2. **切り取り**で 4:3 になるよう範囲を選ぶ。選択サイズが画面に出る場合、幅:高さ = 4:3（例: 4000 × 3000、2000 × 1500）を目安にする
3. **サイズ変更** → **ピクセル** → 横を `1200` にする。縦横比の維持をオンにし、縦が `900` になることを確認する。ならない場合はクロップが 4:3 でない
4. **名前を付けて保存** → JPEG 画像。§3 のファイル名にする
5. エクスプローラーのプロパティでサイズを見る。150KB 超なら、もう一度開いて JPEG の品質を下げるか、別ツールで圧縮する

ペイントで JPEG 品質を細かく指定できないときは、保存後に [Squoosh](https://squoosh.app) で Resize 1200×900・MozJPEG quality 80 に通す。

### 6.3 容量だけ詰めるとき

画素は足りているが重いとき:

- JPEG 品質を 75〜80 にする
- 不要な EXIF（位置情報など）を除く
- それでも 200KB を超えるなら、長辺を 1200 のまま再書き出しする（二重 JPEG は画質が落ちるので、できれば原寸からやり直す）

## 7. Front Matter の書き方

紹介（`index.md`）:

```yaml
photos:
  - alt: "フラッシングルビーの馬体"
    caption: "黒鹿毛の牝馬"
    src: "/images/hitokuchi/flashing-ruby/body.jpg"
  - alt: "フラッシングルビーのパドック"
    caption: "パドック"
    src: "/images/hitokuchi/flashing-ruby/paddock.jpg"
```

日記（`{YYYY-MM-DD}-{slug}.md`）:

```yaml
photos:
  - alt: "メイクデビュー小倉のパドック"
    caption: "小倉5R 2歳新馬（2026-07-11）"
    src: "/images/hitokuchi/flashing-ruby/2026-07-11-makedebut-paddock.jpg"
  - alt: "メイクデビュー小倉の本馬場入場"
    caption: "8枠12番"
    src: "/images/hitokuchi/flashing-ruby/2026-07-11-makedebut-track.jpg"
```

パスを間違えると画像が出ず、プレースホルダになる。`public` を `src` に含めない。

雛形は `keiba-blog/src/articles/hitokuchi/template/`。

## 8. 公開前の確認

- [ ] ファイルが `public/images/hitokuchi/{bamei}/` にある
- [ ] ファイル名と `src` が一致している
- [ ] 拡張子は `.jpg`（HEIC ではない）
- [ ] 画素がおおむね 1200 × 900、比が 4:3
- [ ] 1 枚 150KB 以下（少なくとも 200KB 以下）
- [ ] `alt` がある。`caption` が必要なら入っている
- [ ] 紹介の先頭が、見せたい写真になっている
- [ ] 開発サーバーでスライドを通し、顔・ゼッケンが切れていない

画像を足したあとは、通常どおりビルドして `dist/images/` に含まれることを確認する。デプロイは [デプロイ（Xserver）](./deploy.md)。

## 9. よくある失敗

| 現象 | 原因 | 対処 |
| ---- | ---- | ---- |
| プレースホルダのまま | `src` がコメントのまま、またはパス違い | `public` なしの `/images/hitokuchi/...` にする |
| 頭や蹄が切れる | 16:9 / 縦のまま置いた | 4:3 横にクロップしてから置く |
| ページが重い | 原寸 JPEG を置いた | 1200 × 900・150KB 以下に書き直す |
| 画像が出ない | HEIC / 大文字 `.JPG` だけの環境差 | `.jpg` の JPEG にする |
| 馬名フォルダが見つからない | 記事フォルダ名と不一致 | `{bamei}` と同じ名前にする |

`srcset`（画面ごとに小さいファイルを選ぶ仕組み）は使っていない。枚数が少ないうちは 1200 × 900 の 1 ファイルで足りる。

## 10. 関連

- [愛馬日記 UI 設計](../03_design/UI_design/profile/aiba-diary.md)
- [アーキテクチャ設計書 §4.2 Front Matter](../03_design/architecture_design.md#42-front-matter定義)
- 雛形: `keiba-blog/src/articles/hitokuchi/template/`
- 表示: `keiba-blog/src/pages/AibaDiary.tsx` の `HorsePhotos`
