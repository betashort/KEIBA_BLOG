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

Weight は SD WebUI / ComfyUI の `(token:1.x)`。重要句だけ付ける（1.2〜1.5。全部に付けると効かなくなる）。

Positive の先頭に付ける:

```
(isolated racecourse oval graphic:1.3), (centered:1.2), (top-down view:1.4), (flat vector:1.4), (concentric ellipses:1.4), (clean hard edges:1.2), (no photorealism:1.3), (no text:1.4), (no numbers:1.4), (no logo:1.3), (pure white background:1.4)
```

Negative（共通）:

```
(photograph:1.4), (photorealism:1.5), (satellite photo:1.4), (map screenshot:1.4), (JRA official map:1.5), (club logo:1.3), (side-view horse:1.5), (horse body silhouette:1.5), jockey, (grandstand photo:1.3), people, (text:1.5), (letters:1.4), (numbers:1.5), distance markers, watermark, (3d render:1.3), isometric city
```

## 2. バリエーション

### 同心楕円（上から見た競馬場）

```
(three concentric ovals:1.4), (thick outer ring as the track:1.3), thinner inner rings, (simple geometric racetrack icon:1.3), (no buildings:1.3), (no infield lake details:1.3), (no labels:1.4)
```

### 馬は点のみ

個体にしない。点は3〜5個まで。

```
(top-down racecourse oval:1.3), (horses as tiny dots on the track only:1.4), (three to five small circles:1.3), (no horse shapes:1.5), (no silhouettes of horses:1.5), dots along the outer ring
```

### 芝／ダート（形は同じ）

同じ線画を2色で書き出す。生成で色を決めても、最終はテンプレートの HEX に寄せる。

芝:

```
(same concentric racecourse oval:1.3), (turf green fill on the track ring:1.3), dark infield, (no grass texture photo:1.4), (flat color:1.3)
```

ダート:

```
(same concentric racecourse oval:1.3), (brown dirt fill on the track ring:1.3), dark infield, (no sand texture photo:1.4), (flat color:1.3)
```

## 3. 禁止

- 公式コース図のトレース
- 開催場名・距離の焼き込み
- 横向きの馬

## 4. 変更履歴

| 日付 | 版 | 内容 | 担当 |
| ---- | -- | ---- | ---- |
| 2026-08-23 | 1.1 | プロンプトに weight を追加 | βshort |
| 2026-08-23 | 1.0 | 初版 | βshort |
