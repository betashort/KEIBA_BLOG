# 馬券

上位文書: [素材一覧](./README.md)

馬券成績の識別用。馬のシルエットは置かない（[baken.md](../baken.md)）。金額・回収率・券種コードは焼かない。

## 1. 共通

| 項目 | 値 |
| ---- | -- |
| サイズ | 1024×1024 または 1536×768 |
| 背景 | 純白 `#ffffff`。後で抜いて透過 PNG |
| 中身 | 抽象バーのみ。数字も英字も入れない |

Weight は SD WebUI / ComfyUI の `(token:1.x)`。重要句だけ付ける（1.2〜1.5。全部に付けると効かなくなる）。

Positive の先頭に付ける:

```
(isolated betting ticket graphic:1.3), (centered:1.2), (flat vector:1.4), (rectangular ticket:1.3), (clean hard edges:1.2), (no photorealism:1.3), (no text:1.5), (no numbers:1.5), (no letters:1.5), (no barcode:1.4), (no logo:1.3), (pure white background:1.4)
```

Negative（共通）:

```
(photograph:1.4), (photorealism:1.5), (real printed ticket:1.5), (JRA ticket photo:1.5), (barcode:1.5), (QR code:1.5), (numbers:1.5), (yen:1.4), (odds:1.4), (horse names:1.4), (horse silhouette:1.5), (prediction marks:1.4), (pie chart:1.4), screenshot, watermark, (3d render:1.3), paper grain, (handwritten text:1.4), (kanji:1.5), (latin letters:1.5)
```

## 2. バリエーション

### 券面内の抽象バー（数字なし）

```
(rectangular betting slip:1.3), (dark inner panel:1.2), (three or four horizontal abstract bars of different lengths instead of writing:1.4), (no readable characters:1.5), no perforation required, ledger look, (simple geometric ticket:1.3)
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
| 2026-08-23 | 1.1 | プロンプトに weight を追加 | βshort |
| 2026-08-23 | 1.0 | 初版 | βshort |
