# サラブレッド

上位文書: [素材一覧](./README.md)

一口馬主の記号が主用途。馬券サムネには置かない（[common.md](../common.md)）。色（牡／牝／セン）はテンプレート側。

## 1. 共通

| 項目 | 値 |
| ---- | -- |
| サイズ | 1024×1024（2頭並びは 1536×768 でも可） |
| 背景 | 純白 `#ffffff`。後で抜いて透過 PNG |
| 色 | 単色塗り。性別色は焼かない |

Positive の先頭に付ける:

```
isolated thoroughbred horse, centered, flat vector graphic, solid fill silhouette, clean hard edges, side view unless specified, no photorealism, no texture, no text, no numbers, no logo, no tack brand, pure white background
```

Negative（共通）:

```
photograph, photorealism, 3d render, cinematic lighting, horse face close-up, muzzle portrait, paddock photo, crowd, club logo, JRA logo, racing silks pattern, text, numbers, saddle cloth number, watermark, scenery, grass field photo, blurry, watercolor, anime mascot, extra legs, deformed anatomy
```

ジョッキーなしのバリエーションでは Negative に次を足す:

```
jockey, rider, person, groom, handler
```

## 2. スタイル（シルエット）

どのポーズにも末尾へ足してよい。これが既定。

```
solid silhouette, no internal details, no visible eye, no mane texture, no muscle shading, one flat color
```

## 3. バリエーション

共通 Positive ＋ シルエット句のあとに続ける。

### 横向き

愛馬日記の既定。1頭。

```
one horse, full body, side view, standing, facing right, four legs visible, simple tail, ownership symbol not a portrait
```

### 2頭並び

ポートフォリオ／カテゴリ既定。同サイズ。色分けは後工程。

```
two horses, full body, side view, same size, standing side by side, both facing right, equal weight, no overlapping that hides a horse, no herd, exactly two
```

### 餌を食べる

```
one horse, full body, side view, head lowered eating, grazing or eating from the ground, no feed bucket logo, no person, no hay photorealism
```

### パドック風（ジョッキーなし）

人物を出さない。誘導する人も置かない。

```
one horse, full body, walking, side view, paddock walking pose, no jockey, no groom, no lead person, no lead rope, no crowd, no racecourse buildings
```

### 走っている（ジョッキーなし）

```
one horse, full body, galloping, side view, riderless, legs in running pose, no jockey, no saddle cloth number
```

### 走っている（ジョッキーあり）

人物は識別できないシルエットに留める。Negative から jockey / person を外す。

```
one horse galloping, side view, jockey as a simple tiny silhouette on the saddle, no face, no racing silks pattern, no helmet brand, flat graphic, not a portrait of a person
```

このバリエーション専用 Negative:

```
photograph, photorealism, 3d render, identifiable person, face, racing silks pattern, club logo, saddle cloth number, text, numbers, crowd, camera, watermark
```

### 立ち上がる

```
one horse, full body, rearing, standing on hind legs, side view, no rider, dramatic pose still readable as a horse at small size
```

### 放牧

風景写真にしない。馬だけ切り出す。

```
one horse, full body, relaxed standing, side view, pasture horse pose, head slightly down or level, no fence photo, no field landscape, isolated horse only
```

## 4. 禁止

- 馬の顔アップ・実在馬に見える斑紋
- クラブロゴ・ゼッケン番号
- 頭数の書き込み

## 5. 変更履歴

| 日付 | 版 | 内容 | 担当 |
| ---- | -- | ---- | ---- |
| 2026-08-23 | 1.0 | 初版 | βshort |
