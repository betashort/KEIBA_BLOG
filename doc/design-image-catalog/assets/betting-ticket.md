# 馬券

上位文書: [素材一覧](./README.md)

馬券成績の識別用。馬のシルエットは置かない（[baken.md](../baken.md)）。金額・回収率・券種コードは焼かない。

## 1. 共通

| 項目 | 値 |
| ---- | -- |
| サイズ | 1024×1024 または 1536×768 |
| 背景 | 純白 `#ffffff`。後で抜いて透過 PNG |
| 中身 | 抽象バーのみ。数字も英字も入れない |

Positive の先頭に付ける:

```
isolated betting ticket graphic, centered, flat vector, rectangular ticket, clean hard edges, no photorealism, no text, no numbers, no letters, no barcode, no logo, pure white background
```

Negative（共通）:

```
photograph, photorealism, real printed ticket, JRA ticket photo, barcode, QR code, numbers, yen, odds, horse names, horse silhouette, prediction marks, pie chart, screenshot, watermark, 3d render, paper grain, handwritten text, kanji, latin letters
```

## 2. バリエーション

### 券面内の抽象バー（数字なし）

```
rectangular betting slip, dark inner panel, three or four horizontal abstract bars of different lengths instead of writing, no readable characters, no perforation required, ledger look, simple geometric ticket
```

バーが文字に見えたら捨てて再生成する。

## 3. 禁止

- 「+54,000円」などの確定金額
- 馬名・組番・オッズ
- 本物の馬券写真
- 円グラフ

## 4. 変更履歴

| 日付 | 版 | 内容 | 担当 |
| ---- | -- | ---- | ---- |
| 2026-08-23 | 1.0 | 初版 | βshort |
