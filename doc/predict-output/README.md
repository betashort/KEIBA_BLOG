# レース予想 YAML（別プロジェクト出力）

別プロジェクトが開催日単位で出力する予想データの契約。ブログの `src/articles/predict/{YYYY-MM-DD}/index.md` へ反映する入力になる。

| ファイル | 用途 |
| -------- | ---- |
| [template.yaml](./template.yaml) | フィールド定義。コピーして使う |
| [sample.yaml](./sample.yaml) | 印ルールを満たすサンプル（2025-07-19） |
| [schema.json](./schema.json) | YAML の JSON Schema（エディタ検証用） |

文字コードは UTF-8。ファイル名は `{YYYY-MM-DD}.yaml`（`date` と一致）。

## 印の決定

各レースで馬は重複させない。`horses[].finishRank` が着順予想、`horses[].placeProb` が 3 着以内確率。

| 印 | 規則 |
| -- | ---- |
| ◎ | `finishRank == 1`（1 着予想） |
| 〇 | `finishRank == 2`（2 着予想） |
| ▲ | `finishRank == 3`（3 着予想） |
| ★ | 上記 3 頭を除き、`placeProb` が最も高い馬 |
| △ | さらにそれを除き、`placeProb` が 2 番目に高い馬 |

印の文字は次で固定する（`○` U+25CB は使わない）。

| 印 | Unicode |
| -- | ------- |
| ◎ | U+25CE |
| 〇 | U+3007 |
| ▲ | U+25B2 |
| △ | U+25B3 |
| ★ | U+2605 |

候補が足りない印はキーごと省略する（頭数 4 以下など）。

`placeProb` が同点のときは **馬番の昇順**で先に取る。`finishRank` が同点にならないよう、着順予想側も同点時は馬番昇順で 1..N を振る。

`marks` の値は `"{馬番} {馬名}"`（半角スペース 1 つ。馬番の先頭ゼロなし）。`marks` は上記ルールから算出し、`horses` と矛盾させない。

## ブログへの写像

`index.md` は Front Matter のみ使う。次をコピーし、`category: "predict"` を付ける。`horses` / `version` / `generatedAt` はブログへ渡さない。

| 出力 | `index.md` |
| ---- | ---------- |
| `date` | `date`（フォルダ名 `{YYYY-MM-DD}` と一致） |
| `meetings[].venue` | 同左 |
| `meetings[].races[]` の `number` / `className` / `name` / `course` / `runners` / `marks` / `bets` | 同左 |

`articleSlug` はブログ側の手書き。出力 YAML には含めない。反映時は既存の `articleSlug` を残す。

`bets` は一覧表示用の文字列配列。買い目の生成ルールはこの契約の対象外（未設定なら `[]`）。

## 変更履歴

| 日付 | 内容 |
| ---- | ---- |
| 2026-08-23 | 初版（schema `version: 1`） |
