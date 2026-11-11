---
title: "レース名 予想"
date: "2025-01-01"
description: "開催日 競馬場 Rn レース名のレース予想"
category: "predict"
tags: ["予想", "競馬場名"]
venue: "競馬場名"
raceNumber: 11
marks:
  "◎": "1 馬名"
  "〇": "2 馬名"
bets:
  - "単勝 1"
  - "馬連 1-2"
featured:
  - number: 1
    name: 馬名
    note: 評価コメント
  - number: 2
    name: 馬名
    note: 評価コメント
entries:
  - number: 1
    name: 馬名
    speed: 80
    stamina: 70
    power: 70
    guts: 70
    intelligence: 70
    timeIndex: 90
    matchIndex: 85
    rating: 110
  - number: 2
    name: 馬名
    speed: 75
    stamina: 72
    power: 68
    guts: 66
    intelligence: 74
    timeIndex: 84
    matchIndex: 80
    rating: 102
---

展開コメント。

`template` フォルダは読み込み対象外です。
日付フォルダ直下へ `{venueSlug}-{number}R/index.md` としてコピーします（例: `kokura-11R`）。
`venue` と `raceNumber` を開催日ファイルのレースと一致させると、詳細記事へリンクされます。
