# 蹄鉄

上位文書: [素材一覧](./README.md)

ブログやサイト全体のアクセント。一口馬主の馬シルエット、馬券の矩形とは別物。

## 1. 共通

| 項目 | 値 |
| ---- | -- |
| サイズ | 1024×1024 |
| 背景 | プロンプトではアルファは出ない。既定は純白 `#ffffff` を焼いて後で抜く。LayerDiffuse なら前景＋アルファを直接出す |
| 色 | 単色。最終色はテンプレート側 |

Weight は SD WebUI / ComfyUI の `(token:1.x)`。重要句だけ付ける（1.2〜1.5。全部に付けると効かなくなる）。

`transparent background` は書かない。チェッカー柄や白い背景が RGB に焼けるだけ。

Negative（共通）:

```
(photograph:1.4), (photorealism:1.5), (3d render:1.3), cinematic lighting, (glossy:1.3), (rust:1.4), (dirt:1.3), engraving, (text:1.5), (numbers:1.5), (letters:1.4), watermark, (club logo:1.3), (JRA logo:1.3), (horse:1.4), (horse head:1.4), crowd, scenery, (shadow:1.3), (reflection:1.3), blurry, watercolor, extra objects, (checkerboard:1.4), transparency grid, checkered background
```

## 2. Positive（白抜き・既定）

そのまま貼る。

### 正面（U字・開いた側が上）

```
(isolated object:1.3), (centered:1.2), (flat vector graphic:1.4), (solid color:1.3), (clean hard edges:1.2), (high contrast:1.2), (no photorealism:1.3), (no texture:1.3), (no text:1.4), (no numbers:1.4), (no logo:1.3), (pure white background:1.4), (single horseshoe:1.4), (front view:1.2), (U-shape opening facing up:1.4), classic lucky horseshoe icon, (simple geometric silhouette:1.3), (one object only:1.3)
```

### アウトライン

```
(isolated object:1.3), (centered:1.2), (flat vector graphic:1.4), (solid color:1.3), (clean hard edges:1.2), (high contrast:1.2), (no photorealism:1.3), (no texture:1.3), (no text:1.4), (no numbers:1.4), (no logo:1.3), (pure white background:1.4), (single horseshoe:1.4), (front view:1.2), (U-shape opening facing down:1.4), (outline only:1.4), (hollow center:1.3), (even stroke width:1.3), (no fill:1.3), (line icon:1.2)
```

### 塗りつぶし

```
(isolated object:1.3), (centered:1.2), (flat vector graphic:1.4), (solid color:1.3), (clean hard edges:1.2), (high contrast:1.2), (no photorealism:1.3), (no texture:1.3), (no text:1.4), (no numbers:1.4), (no logo:1.3), (pure white background:1.4), (single horseshoe:1.4), (front view:1.2), (U-shape opening facing down:1.4), (solid fill silhouette:1.4), no inner holes except the U opening, (no outline stroke:1.3)
```

### 2つ重ね

```
(isolated object:1.3), (centered:1.2), (flat vector graphic:1.4), (solid color:1.3), (clean hard edges:1.2), (high contrast:1.2), (no photorealism:1.3), (no texture:1.3), (no text:1.4), (no numbers:1.4), (no logo:1.3), (pure white background:1.4), (two horseshoes overlapping:1.3), both U-shape opening facing down, slightly offset, (same size:1.3), (solid fill:1.2), (still readable as horseshoes:1.3), (no extra objects:1.3)
```

### 斜め

```
(isolated object:1.3), (centered:1.2), (flat vector graphic:1.4), (solid color:1.3), (clean hard edges:1.2), (high contrast:1.2), (no photorealism:1.3), (no texture:1.3), (no text:1.4), (no numbers:1.4), (no logo:1.3), (pure white background:1.4), (single horseshoe:1.4), (rotated 30 degrees:1.3), (U-shape opening facing down-right:1.3), (solid fill silhouette:1.3), (one object:1.3), (centered:1.2)
```

## 3. Positive（LayerDiffuse）

白背景句なし。サイズは 64 の倍数（1024×1024 のまま）。そのまま貼る。

### 正面（U字・開いた側が上）

```
(isolated object:1.3), (centered:1.2), (flat vector graphic:1.4), (solid color:1.3), (clean hard edges:1.2), (high contrast:1.2), (no photorealism:1.3), (no texture:1.3), (no text:1.4), (no numbers:1.4), (no logo:1.3), (single horseshoe:1.4), (front view:1.2), (U-shape opening facing up:1.4), classic lucky horseshoe icon, (simple geometric silhouette:1.3), (one object only:1.3)
```

### アウトライン

```
(isolated object:1.3), (centered:1.2), (flat vector graphic:1.4), (solid color:1.3), (clean hard edges:1.2), (high contrast:1.2), (no photorealism:1.3), (no texture:1.3), (no text:1.4), (no numbers:1.4), (no logo:1.3), (single horseshoe:1.4), (front view:1.2), (U-shape opening facing down:1.4), (outline only:1.4), (hollow center:1.3), (even stroke width:1.3), (no fill:1.3), (line icon:1.2)
```

### 塗りつぶし

```
(isolated object:1.3), (centered:1.2), (flat vector graphic:1.4), (solid color:1.3), (clean hard edges:1.2), (high contrast:1.2), (no photorealism:1.3), (no texture:1.3), (no text:1.4), (no numbers:1.4), (no logo:1.3), (single horseshoe:1.4), (front view:1.2), (U-shape opening facing down:1.4), (solid fill silhouette:1.4), no inner holes except the U opening, (no outline stroke:1.3)
```

### 2つ重ね

```
(isolated object:1.3), (centered:1.2), (flat vector graphic:1.4), (solid color:1.3), (clean hard edges:1.2), (high contrast:1.2), (no photorealism:1.3), (no texture:1.3), (no text:1.4), (no numbers:1.4), (no logo:1.3), (two horseshoes overlapping:1.3), both U-shape opening facing down, slightly offset, (same size:1.3), (solid fill:1.2), (still readable as horseshoes:1.3), (no extra objects:1.3)
```

### 斜め

```
(isolated object:1.3), (centered:1.2), (flat vector graphic:1.4), (solid color:1.3), (clean hard edges:1.2), (high contrast:1.2), (no photorealism:1.3), (no texture:1.3), (no text:1.4), (no numbers:1.4), (no logo:1.3), (single horseshoe:1.4), (rotated 30 degrees:1.3), (U-shape opening facing down-right:1.3), (solid fill silhouette:1.3), (one object:1.3), (centered:1.2)
```

## 4. 禁止

- 実物の錆びた蹄鉄写真
- 釘・ブランド刻印・文字

## 5. 変更履歴

| 日付 | 版 | 内容 | 担当 |
| ---- | -- | ---- | ---- |
| 2026-08-23 | 1.3 | Positive をコピペ用の完成形にまとめた | βshort |
| 2026-08-23 | 1.2 | 透過は白抜き／LayerDiffuse。`transparent background` は使わない | βshort |
| 2026-08-23 | 1.1 | プロンプトに weight を追加 | βshort |
| 2026-08-23 | 1.0 | 初版 | βshort |
