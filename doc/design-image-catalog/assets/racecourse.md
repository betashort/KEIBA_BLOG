# 競馬場

上位文書: [素材一覧](./README.md)

会場としてのコース。分析・予想の「場の雰囲気」用。[コース楕円](./course-oval.md) より具体的だが、公式図・場名・スタンド実写は使わない。

## 1. 共通

| 項目 | 値 |
| ---- | -- |
| サイズ | 1536×768 または 1024×1024 |
| 背景 | 純白 `#ffffff`。後で抜いて透過 PNG |
| 文字 | 場名・距離・コーナー番号は焼かない |

Positive の先頭に付ける:

```
isolated racecourse illustration, centered, flat vector graphic, stylized track layout, clean hard edges, no photorealism, no text, no numbers, no logo, pure white background
```

Negative（共通）:

```
photograph, photorealism, satellite photo, Google map, JRA official course map, screenshot, club logo, trademark, text, letters, kanji, numbers, distance markers, crowd photo, grandstand photo, watermark, 3d cinematic render
```

## 2. バリエーション

### ターフのみ

馬を置かない。芝の環だけ。

```
empty turf racetrack from above or slight angle, oval grass track, infield simple flat color, no horses, no people, no buildings, no advertising boards, stylized not a real photo
```

### 馬が走っている

個体の横向きシルエットは小さく、主役はコース。分析の「点」よりは馬に見えるが、顔アップにはしない。

```
stylized racetrack, several tiny horses running on the turf as small simple shapes, no face close-up, no jockey details, no saddle cloth numbers, track remains the main shape
```

Negative に足す:

```
horse portrait, paddock, one huge horse in foreground
```

### 各競馬場

公式マップを模写しない。回り方向と大まかな形だけの stylized oval。画像に場名を入れない。ファイル名で区別する（例: `racecourse-tokyo.png`）。

共通の追記:

```
stylized Japanese racecourse oval, simplified layout, not an official map, no labels, no start gate text
```

場ごとの追記（どれか1つ）:

| 場 | Positive 追記 |
| -- | ------------- |
| 東京 | `left-handed large oval, long home stretch, spacious track` |
| 中山 | `right-handed compact oval, tight turns, smaller circumference feel` |
| 阪神 | `right-handed oval, inner and outer track suggested by two rings` |
| 京都 | `right-handed oval, inner and outer rings, long stretch feel` |
| 中京 | `left-handed oval, regular racetrack proportions` |
| 新潟 | `left-handed oval, very long straight along one side` |
| 福島 | `right-handed small oval, compact local racecourse shape` |
| 小倉 | `right-handed oval, compact track` |
| 札幌 | `right-handed rounder oval, more circular than elongated` |
| 函館 | `right-handed rounder oval, compact seaside track feel, no sea photo` |

地方場も同じルール（形だけ、場名なし）。特徴が弱い場は「ターフのみ」の汎用楕円でよい。

## 3. 禁止

- JRA / 地方公式のコース図・航空写真
- 場名・コーナー番号・距離標
- クラブロゴ・広告板の文字

## 4. 変更履歴

| 日付 | 版 | 内容 | 担当 |
| ---- | -- | ---- | ---- |
| 2026-08-23 | 1.0 | 初版 | βshort |
