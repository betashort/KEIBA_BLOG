---
date: "2025-01-01"
category: "predict"
meetings:
  - venue: "競馬場名"
    races:
      - number: 1
        className: "未勝利"
        name: "レース名"
        course: "芝1200m"
        runners: 16
        marks:
          "◎": "1 馬名"
          "〇": "2 馬名"
          "▲": "3 馬名"
          "△": "4 馬名"
          "★": "5 馬名"
        bets:
          - "単勝 1"
          - "馬連 1-2"
---

`template` フォルダは読み込み対象外です。
コピーして `src/articles/predict/{YYYY-MM-DD}/index.md` として使います。
注目レースの詳細は `src/articles/predict/{YYYY-MM-DD}/{venueSlug}-{number}R/index.md` に置きます（例: `kyoto-11R`）。
公開 URL は `/race-predict/{YYYYMMDD}/{venueSlug}-{number}R` です。
