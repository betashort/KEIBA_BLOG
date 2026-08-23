# コース楕円

上位文書: [素材一覧](./README.md)

レース分析の識別用。上から見た抽象コース。個体の馬シルエットは使わない（[analysis.md](../analysis.md)）。予想サムネには置かない。

[競馬場](./racecourse.md) は会場の絵。[コース楕円](./course-oval.md) は記号としての同心楕円。

## 1. 共通

| 項目 | 値 |
| ---- | -- |
| サイズ | 1024×1024 または 1536×768 |
| 背景 | 純白 `#ffffff`。後で抜いて透過 PNG |
| 色 | 芝／ダートはテンプレート側で分ける。形は同じ |

Positive の先頭に付ける:

```
isolated racecourse oval graphic, centered, top-down view, flat vector, concentric ellipses, clean hard edges, no photorealism, no text, no numbers, no logo, pure white background
```

Negative（共通）:

```
photograph, photorealism, satellite photo, map screenshot, JRA official map, club logo, side-view horse, horse body silhouette, jockey, grandstand photo, people, text, letters, numbers, distance markers, watermark, 3d render, isometric city
```

## 2. バリエーション

### 同心楕円（上から見た競馬場）

```
three concentric ovals, thick outer ring as the track, thinner inner rings, simple geometric racetrack icon, no buildings, no infield lake details, no labels
```

### 馬は点のみ

個体にしない。点は3〜5個まで。

```
top-down racecourse oval, horses as tiny dots on the track only, three to five small circles, no horse shapes, no silhouettes of horses, dots along the outer ring
```

### 芝／ダート（形は同じ）

同じ線画を2色で書き出す。生成で色を決めても、最終はテンプレートの HEX に寄せる。

芝:

```
same concentric racecourse oval, turf green fill on the track ring, dark infield, no grass texture photo, flat color
```

ダート:

```
same concentric racecourse oval, brown dirt fill on the track ring, dark infield, no sand texture photo, flat color
```

## 3. 禁止

- 公式コース図のトレース
- 開催場名・距離の焼き込み
- 横向きの馬

## 4. 変更履歴

| 日付 | 版 | 内容 | 担当 |
| ---- | -- | ---- | ---- |
| 2026-08-23 | 1.0 | 初版 | βshort |
