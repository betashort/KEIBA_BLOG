# 競馬場

上位文書: [素材一覧](./README.md)

会場としてのコース。分析・予想の「場の雰囲気」用。[コース楕円](./course-oval.md) より具体的だが、公式図・場名・スタンド実写は使わない。

## 1. 共通

| 項目 | 値 |
| ---- | -- |
| サイズ | 1536×768 または 1024×1024 |
| 背景 | 純白 `#ffffff`。後で抜いて透過 PNG |
| 文字 | 場名・距離・コーナー番号は焼かない |

Weight は SD WebUI / ComfyUI の `(token:1.x)`。重要句だけ付ける（1.2〜1.5。全部に付けると効かなくなる）。

Positive の先頭に付ける:

```
(isolated racecourse illustration:1.3), (centered:1.2), (flat vector graphic:1.4), (stylized track layout:1.3), (clean hard edges:1.2), (no photorealism:1.3), (no text:1.4), (no numbers:1.4), (no logo:1.3), (pure white background:1.4)
```

Negative（共通）:

```
(photograph:1.4), (photorealism:1.5), (satellite photo:1.4), (Google map:1.3), (JRA official course map:1.5), screenshot, (club logo:1.3), trademark, (text:1.5), (letters:1.4), (kanji:1.4), (numbers:1.5), distance markers, (crowd photo:1.3), (grandstand photo:1.3), watermark, (3d cinematic render:1.3)
```

## 2. バリエーション

### ターフのみ

馬を置かない。芝の環だけ。

```
(empty turf racetrack:1.3), (from above or slight angle:1.2), (oval grass track:1.3), infield simple flat color, (no horses:1.4), (no people:1.3), (no buildings:1.3), (no advertising boards:1.3), (stylized not a real photo:1.3)
```

### 馬が走っている

個体の横向きシルエットは小さく、主役はコース。分析の「点」よりは馬に見えるが、顔アップにはしない。

```
(stylized racetrack:1.3), (several tiny horses running on the turf:1.2), small simple shapes, (no face close-up:1.4), (no jockey details:1.3), (no saddle cloth numbers:1.4), (track remains the main shape:1.3)
```

Negative に足す:

```
(horse portrait:1.4), paddock, (one huge horse in foreground:1.5)
```
