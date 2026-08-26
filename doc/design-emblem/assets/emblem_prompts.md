# エンブレム生成プロンプト（ComfyUI / Stable Diffusion WebUI）

上位文書: [索引](./README.md) / [サイトエンブレム](./emblem.md)

サイトエンブレムを ComfyUI または Stable Diffusion WebUI（A1111 / Forge）で作るときのプロンプト。  
**日本語・サイト名は生成しない。** Header の「競馬βLab」は後から乗せる（[emblem.md §5](./emblem.md)）。

拡散モデルは β の左右反転が弱い。まず [§6 一括生成](#6-一括生成) を試し、形が崩れたら [§7 分割生成](#7-分割生成) に切り替える。

## 1. 前提

仕様の核は次の3点である（[emblem.md §2](./emblem.md)）。

| 位置 | 形 |
| ---- | -- |
| 中央 | 蹄鉄。U 字、開いた側が上 |
| 左 | β の左右反転。ステムが蹄鉄側、ボウルが外側（翼） |
| 右 | β そのまま。ステムが蹄鉄側、ボウルが外側（翼） |

鳥の羽・ペガサスは描かない。翼に見えるのは β の字形である。

推奨パイプライン:

1. 下のプロンプトでマークだけを生成する（白地・正方形）
2. 生成物を [assets](./assets/) に置く
3. 左右がミラー対か、蹄鉄の開口が上かを確認する
4. 必要なら Inkscape / Figma でパスにトレースし、色をトークンへ寄せる
5. Header・favicon へはトレース後の単色マークを使う

作者アイコン（[author-icon.md](./author-icon.md)）は img2img の参照にしない。

## 2. 共通設定

蹄鉄素材（[horseshoe.md](../design-image-catalog/assets/horseshoe.md)）に合わせる。サムネ用の 1216×640 は使わない。

| 項目 | 値 |
| ---- | -- |
| 生成サイズ | **1024×1024**（8 の倍数） |
| サンプラー | Euler a / DPM++ 2M Karras |
| Steps | 28–36（SDXL）。Flux は各 UI の既定 |
| CFG | 5–7（SDXL） |
| モデル | SDXL または Flux。写実系チェックポイントは使わない |
| スタイル | flat vector, graphic design, solid fill silhouette |
| ControlNet | Canny または Lineart、strength 0.55–0.75、end 0.85 |
| img2img denoise | 0.25–0.40（分割生成の合成後に整えるとき） |

ControlNet を使う場合は、自分で描いた線画（中央蹄鉄＋左右の β）を入力にする。作者アイコンは入力にしない。

## 3. 共通プロンプト

コピーして先頭に付ける。つなぎ済みは [§6](#6-一括生成)。部品だけの差し替えは §5。

### Positive（共通）

```
isolated logo mark, centered, square composition, flat vector graphic, graphic design emblem, solid color, clean hard edges, high contrast silhouette, no photorealism, no texture, no paper grain, no film grain, sRGB, professional website favicon, simple shapes only, pure white background
```

### Negative（共通）

```
photograph, photorealism, realistic photo, 3d render, cinematic lighting, glossy, rust, dirt, nails, engraving, metallic horseshoe photo, strong texture, noise, film grain, bokeh, shadow, reflection, people, crowd, jockey, anime character, mascot, girl, face, cigarette, smoke, horse body, horse head, paddock, club logo, JRA logo, trademark, watermark, screenshot, bird wings, feathers, angel wings, pegasus, pegasus wings, latin letter B, german eszett, SS glyph, kanji, hiragana, katakana, numbers, the word Lab, site name, URL, prediction marks, racecourse oval, betting ticket, neon, rainbow, watercolor, oil painting, blurry, extra objects
```

日本語と `Lab` を Negative に入れているのは、モデルがサイト名を焼かないようにするため。β はギリシャ文字として Positive 側で指定する。

## 4. レイアウト拘束（プロンプト末尾に付ける）

```
square 1:1 composition, all important shapes inside the center 80%, 10% empty margin on all sides, no text besides the two greek beta letterforms, no other letters, no numbers, circular crop safe
```

## 5. バリエーション

仕様: [emblem.md](./emblem.md)  
HEX: ink `#171717` / paper `#ffffff` / inverse `#f4f1ea` / accent `#9f1239`

共通 Positive → 下の Positive → レイアウト拘束、の順でつなぐ。コピペ用の完成形は [§6](#6-一括生成)。

### 5.1 ライト（既定）

白地にインク。Header・favicon の正。

```
website emblem, solid fill #171717 on white, one horseshoe in the exact center, front view U-shape horseshoe opening facing up, rounded ends, even stroke, not a photo, greek small letter beta as wings attached to the horseshoe, left side is a horizontally mirrored greek letter beta, right side is an upright greek letter beta, both beta stems touch the outer sides of the horseshoe, beta bowls face outward like wings, left and right are perfect mirrors, no bird feathers, no extra ornaments, logo mark only
```

### 5.2 ダーク

暗地用。背景は生成せず透過で抜くか、後で置換する。

```
website emblem, solid fill off-white #f4f1ea, same composition as the light emblem, one centered horseshoe U-shape opening facing up, mirrored greek beta on the left, upright greek beta on the right, stems attached to the horseshoe, outward bowls as wings, isolated mark, white background for knockout
```

色は後処理で `#f4f1ea` に寄せてよい。生成時点でオフホワイトになっていなくても、シルエットが正しければ採用する。

### 5.3 バッジ（apple-touch / PWA）

円の中にマーク。翼が円からはみ出さない。

```
app icon badge, filled dark circle #171717, centered emblem in off-white #f4f1ea, horseshoe U-shape opening facing up in the middle, mirrored greek beta left, upright greek beta right, wings inside the circle with padding, no outer square frame, no text, circular icon
```

### 5.4 アクセント（カウンター赤）

ライトと同じ形。左右 β の閉じた穴だけ `#9f1239`。16px では使わない。

```
website emblem, solid fill #171717 on white, centered horseshoe U-shape opening facing up, mirrored greek beta left, upright greek beta right, stems attached to the horseshoe, each beta counter filled with a small round accent #9f1239, left and right accents symmetric, no other red, no bird feathers
```

左右で赤の位置が違う生成は捨てる。

## 6. 一括生成

§3〜§5 をつないだコピペ用。Positive / Negative をそのまま貼る。崩れたら [§7](#7-分割生成)。

Negative は全バリエーション共通。各節の Positive だけ差し替える。

### Negative（一括・共通）

```
photograph, photorealism, realistic photo, 3d render, cinematic lighting, glossy, rust, dirt, nails, engraving, metallic horseshoe photo, strong texture, noise, film grain, bokeh, shadow, reflection, people, crowd, jockey, anime character, mascot, girl, face, cigarette, smoke, horse body, horse head, paddock, club logo, JRA logo, trademark, watermark, screenshot, bird wings, feathers, angel wings, pegasus, pegasus wings, latin letter B, german eszett, SS glyph, kanji, hiragana, katakana, numbers, the word Lab, site name, URL, prediction marks, racecourse oval, betting ticket, neon, rainbow, watercolor, oil painting, blurry, extra objects
```

### 6.1 ライト（既定）

```
isolated logo mark, centered, square 1:1 composition, flat vector graphic, graphic design emblem, website favicon, solid fill #171717 on pure white background, clean hard edges, high contrast silhouette, no photorealism, no texture, no paper grain, no film grain, sRGB, simple shapes only, one horseshoe in the exact center, front view U-shape horseshoe opening facing up, rounded ends, even stroke, not a photo, greek small letter beta as wings attached to the horseshoe, left side is a horizontally mirrored greek letter beta, right side is an upright greek letter beta, both beta stems touch the outer sides of the horseshoe, beta bowls face outward like wings, left and right are perfect mirrors, all important shapes inside the center 80%, 10% empty margin on all sides, circular crop safe, no bird feathers, no extra ornaments, no other letters, no numbers, logo mark only
```

### 6.2 ダーク

```
isolated logo mark, centered, square 1:1 composition, flat vector graphic, graphic design emblem, website favicon, solid fill off-white #f4f1ea on pure white background for knockout, clean hard edges, high contrast silhouette, no photorealism, no texture, no paper grain, no film grain, sRGB, simple shapes only, one horseshoe in the exact center, front view U-shape horseshoe opening facing up, rounded ends, even stroke, not a photo, greek small letter beta as wings attached to the horseshoe, left side is a horizontally mirrored greek letter beta, right side is an upright greek letter beta, both beta stems touch the outer sides of the horseshoe, beta bowls face outward like wings, left and right are perfect mirrors, all important shapes inside the center 80%, 10% empty margin on all sides, circular crop safe, no bird feathers, no extra ornaments, no other letters, no numbers, logo mark only
```

### 6.3 バッジ（apple-touch / PWA）

```
isolated app icon badge, centered, square 1:1 composition, flat vector graphic, graphic design emblem, filled dark circle #171717, emblem in off-white #f4f1ea inside the circle, clean hard edges, high contrast silhouette, no photorealism, no texture, no paper grain, no film grain, sRGB, simple shapes only, one horseshoe in the exact center, front view U-shape horseshoe opening facing up, rounded ends, even stroke, greek small letter beta as wings attached to the horseshoe, left side is a horizontally mirrored greek letter beta, right side is an upright greek letter beta, both beta stems touch the outer sides of the horseshoe, beta bowls face outward like wings, left and right are perfect mirrors, wings stay inside the circle with padding, all important shapes inside the center 80%, 10% empty margin on all sides, circular crop safe, no outer square frame, no bird feathers, no extra ornaments, no text, no other letters, no numbers
```

### 6.4 アクセント（カウンター赤）

```
isolated logo mark, centered, square 1:1 composition, flat vector graphic, graphic design emblem, website favicon, solid fill #171717 on pure white background, clean hard edges, high contrast silhouette, no photorealism, no texture, no paper grain, no film grain, sRGB, simple shapes only, one horseshoe in the exact center, front view U-shape horseshoe opening facing up, rounded ends, even stroke, not a photo, greek small letter beta as wings attached to the horseshoe, left side is a horizontally mirrored greek letter beta, right side is an upright greek letter beta, both beta stems touch the outer sides of the horseshoe, beta bowls face outward like wings, left and right are perfect mirrors, each beta counter filled with a small round accent #9f1239, left and right accents symmetric, no other red, all important shapes inside the center 80%, 10% empty margin on all sides, circular crop safe, no bird feathers, no extra ornaments, no other letters, no numbers, logo mark only
```

## 7. 分割生成

一発で β が B や羽になるときは、部品を分けて合成する。

### 7.1 蹄鉄

[horseshoe.md 正面](../design-image-catalog/assets/horseshoe.md) の Positive / Negative をそのまま使う。開き側は上。

### 7.2 右翼（β 原形）

```
isolated greek small letter beta β, sans-serif bold typographic glyph, upright, solid fill black, white background, one letter only, not latin B, not eszett, not the letter S, not a bird wing, not a ribbon, high contrast, centered
```

Extra negative:

```
latin B, eszett, ampersand, treble clef, bird, feather, ribbon, horseshoe, kanji
```

### 7.3 左翼

7.2 を **水平ミラー**する（エディタの左右反転）。生成し直さない。左右で太さ・カウンターが違わないこと。

### 7.4 合成

1. 中央に蹄鉄
2. 左に反転 β、右に原形 β
3. ステムを蹄鉄の外縁に接する（またはわずかに重ねる）
4. 高さは蹄鉄の 70–80%
5. キャンバスは 1024×1024、セーフエリア中央 80%

合成後の img2img（denoise 0.25–0.40）は、隙間をなじませるためだけに使う。β が羽に化けたら denoise を下げるか、合成のまま止める。

## 8. 捨てる条件

生成直後に次を捨てる。

- 蹄鉄の開口が下・横を向いている
- 左右の β が同じ向き
- β がラテン B、エスツェット、リボン、鳥の羽になっている
- 蹄鉄の**内側**に β がある
- 人物・作者アイコンに寄っている
- 「Lab」「競馬」などの文字が入っている
- 左右 10% や四隅まで図形がはみ出している（円クロップで欠ける）
- 錆びた実物蹄鉄、3D 金属、釘

## 9. 書き出し

| 項目 | 指定 |
| ---- | ---- |
| マスター生成 | 1024×1024 PNG |
| 背景 | 白。抜き後は透過 |
| 色空間 | sRGB |
| 置き場（ラフ） | `doc/design-emblem/assets/` |
| 置き場（完成） | [usage.md](./usage.md) |

色は [emblem.md §4](./emblem.md) のトークンへ後処理で寄せる。モデルの HEX は信用しない。

## 10. ComfyUI メモ

- 空の latent は 1024×1024
- テキスト合成（サイト名）は生成ノードの外
- 一括生成は §6.1 ライトから。崩れたら分割（§7）
- 分割生成のミラーは `Flip`（水平）で足りる。左翼用に別プロンプトを走らせない
- バッチはライト → 崩れなければアクセント、の順

## 11. 変更履歴

| 日付 | 版 | 内容 | 担当 |
| ---- | -- | ---- | ---- |
| 2026-08-24 | 1.2 | 蹄鉄の開口を素材と同じ上に揃えた。分割生成は horseshoe.md を参照 | βshort |
| 2026-08-23 | 1.1 | 一括生成のコピペ用プロンプト（§6）を追加 | βshort |
| 2026-08-23 | 1.0 | 初版。寸法 SVG の代わりに生成プロンプトを追加 | βshort |
