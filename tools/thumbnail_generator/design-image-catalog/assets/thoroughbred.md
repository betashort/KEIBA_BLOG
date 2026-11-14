# サラブレッド

上位文書: [素材一覧](./README.md)

一口馬主の記号が主用途。馬券サムネには置かない（[common.md](../common.md)）。色（牡／牝／セン）はテンプレート側。

## 1. 共通

| 項目 | 値 |
| ---- | -- |
| サイズ | 1024×1024（2頭並びは 1536×768 でも可） |
| 背景 | 純白 `#ffffff`。後で抜いて透過 PNG |
| 色 | 単色塗り。性別色は焼かない |

Weight は SD WebUI / ComfyUI の `(token:1.x)`。重要句だけ付ける（1.2〜1.5。全部に付けると効かなくなる）。

Positive の先頭に付ける:

```
(isolated thoroughbred horse:1.3), (centered:1.2), (flat vector graphic:1.4), (solid fill silhouette:1.4), (clean hard edges:1.2), (side view unless specified:1.2), (no photorealism:1.3), (no texture:1.3), (no text:1.4), (no numbers:1.4), (no logo:1.3), (no tack brand:1.3), (pure white background:1.4)
```

Negative（共通）:

```
(photograph:1.4), (photorealism:1.5), (3d render:1.3), cinematic lighting, (horse face close-up:1.5), (muzzle portrait:1.5), (paddock photo:1.3), crowd, (club logo:1.3), (JRA logo:1.3), (racing silks pattern:1.4), (text:1.5), (numbers:1.5), (saddle cloth number:1.5), watermark, scenery, (grass field photo:1.3), blurry, watercolor, (anime mascot:1.3), (extra legs:1.4), (deformed anatomy:1.4)
```

ジョッキーなしのバリエーションでは Negative に次を足す:

```
(jockey:1.4), (rider:1.4), (person:1.4), (groom:1.3), handler
```

## 2. スタイル（シルエット）

どのポーズにも末尾へ足してよい。これが既定。

```
(solid silhouette:1.4), (no internal details:1.3), (no visible eye:1.4), (no mane texture:1.3), (no muscle shading:1.3), (one flat color:1.3)
```

## 3. バリエーション

共通 Positive ＋ シルエット句のあとに続ける。

### 横向き

愛馬日記の既定。1頭。

```
(one horse:1.3), (full body:1.3), (side view:1.3), (standing:1.2), (facing right:1.3), (four legs visible:1.3), simple tail, (ownership symbol not a portrait:1.3)
```

### 2頭並び

ポートフォリオ／カテゴリ既定。同サイズ。色分けは後工程。`equal weight` は構図（2頭が同じ大きさ）の指定であり、プロンプトの `(token:1.x)` とは別。

```
(two horses:1.4), (full body:1.2), (side view:1.3), (same size:1.4), standing side by side, (both facing right:1.3), equal weight, (no overlapping that hides a horse:1.3), (no herd:1.4), (exactly two:1.5)
```

### 餌を食べる

```
(one horse:1.3), (full body:1.3), (side view:1.2), (head lowered eating:1.4), grazing or eating from the ground, (no feed bucket logo:1.3), (no person:1.4), (no hay photorealism:1.4)
```

### パドック風（ジョッキーなし）

人物を出さない。誘導する人も置かない。

```
(one horse:1.3), (full body:1.3), (walking:1.3), (side view:1.3), paddock walking pose, (no jockey:1.4), (no groom:1.4), (no lead person:1.4), (no lead rope:1.3), (no crowd:1.3), (no racecourse buildings:1.3)
```

### 走っている（ジョッキーなし）

```
(one horse:1.3), (full body:1.3), (galloping:1.4), (side view:1.3), (riderless:1.4), legs in running pose, (no jockey:1.4), (no saddle cloth number:1.4)
```

### 走っている（ジョッキーあり）

人物は識別できないシルエットに留める。Negative から jockey / person を外す。

```
(one horse galloping:1.3), (side view:1.3), (jockey as a simple tiny silhouette on the saddle:1.3), (no face:1.4), (no racing silks pattern:1.4), (no helmet brand:1.3), (flat graphic:1.3), (not a portrait of a person:1.4)
```

このバリエーション専用 Negative:

```
(photograph:1.4), (photorealism:1.5), (3d render:1.3), (identifiable person:1.5), (face:1.5), (racing silks pattern:1.4), (club logo:1.3), (saddle cloth number:1.5), (text:1.5), (numbers:1.5), crowd, camera, watermark
```

### 立ち上がる

```
(one horse:1.3), (full body:1.3), (rearing:1.4), (standing on hind legs:1.3), (side view:1.3), (no rider:1.4), dramatic pose still readable as a horse at small size
```

### 放牧

風景写真にしない。馬だけ切り出す。

```
(one horse:1.3), (full body:1.3), (relaxed standing:1.2), (side view:1.3), pasture horse pose, head slightly down or level, (no fence photo:1.4), (no field landscape:1.4), (isolated horse only:1.4)
```

## 4. 禁止

- 馬の顔アップ・実在馬に見える斑紋
- クラブロゴ・ゼッケン番号
- 頭数の書き込み

## 5. 変更履歴

| 日付 | 版 | 内容 | 担当 |
| ---- | -- | ---- | ---- |
| 2026-08-23 | 1.1 | プロンプトに weight を追加 | βshort |
| 2026-08-23 | 1.0 | 初版 | βshort |
