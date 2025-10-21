# モバイル対応のUI設計

1. [◾ レスポンシブデザインにする](#-レスポンシブデザインにする)
   1. [画面サイズに応じたCSS](#画面サイズに応じたcss)
2. [ビューポート設定（HTML）](#ビューポート設定html)
3. [モバイルナビゲーション](#モバイルナビゲーション)
   1. [◾ 例: シンプルなハンバーガーメニュー](#-例-シンプルなハンバーガーメニュー)
4. [PWA対応（オプション）](#pwa対応オプション)
5. [Tailwind CSS のモバイル対応の考え方](#tailwind-css-のモバイル対応の考え方)
6. [基本構文](#基本構文)
7. [画面サイズのブレークポイント（デフォルト）](#画面サイズのブレークポイントデフォルト)
8. [例①：モバイル → PCで変化するレイアウト](#例モバイル--pcで変化するレイアウト)
   1. [🔹 1カラム → 2カラムに変わる例](#-1カラム--2カラムに変わる例)
9. [例②：スマホでハンバーガーメニュー、PCで通常ナビ](#例スマホでハンバーガーメニューpcで通常ナビ)
10. [例③：フォント・マージンを調整する](#例フォントマージンを調整する)
11. [例④：画像サイズをレスポンシブ対応に](#例画像サイズをレスポンシブ対応に)
12. [コツまとめ](#コツまとめ)


## ◾ レスポンシブデザインにする

以下の方法でスマホサイズに最適化します。

### 画面サイズに応じたCSS

* CSSメディアクエリを使う

```css
@media screen and (max-width: 768px) {
  .container {
    padding: 10px;
    font-size: 14px;
  }
}
```

## ビューポート設定（HTML）

```html
<!-- index.html の <head> 内に追加 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

## モバイルナビゲーション

スマホではハンバーガーメニューがよく使われます。

### ◾ 例: シンプルなハンバーガーメニュー

```jsx
import { useState } from "react";

function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <nav>
      <button onClick={() => setOpen(!open)}>☰</button>
      {open && (
        <ul>
          <li>ホーム</li>
          <li>ブログ</li>
          <li>お問い合わせ</li>
        </ul>
      )}
    </nav>
  );
}
```

---


## PWA対応（オプション）

スマホアプリのようにインストールできるPWA対応も可能です。

* `vite-plugin-pwa` を使うことで、簡単に設定可能です。

---

とても良い方向です！
Tailwind CSS は **モバイル対応（レスポンシブデザイン）** がとても簡単にできます 💡

以下では「基本の考え方」から「実践コード」まで順に説明します。

---

## Tailwind CSS のモバイル対応の考え方

Tailwind は「**モバイルファースト**」です。
つまり、**最初にスマホ用のスタイル**を書き、
その後に「大きな画面向けの修正」を追加します。

---

## 基本構文

Tailwind のレスポンシブ指定は以下のように書きます👇

```jsx
<p className="text-sm md:text-base lg:text-lg">
  レスポンシブなテキスト
</p>
```

| クラス名           | 意味             |
| -------------- | -------------- |
| `text-sm`      | デフォルト（スマホ）     |
| `md:text-base` | 画面幅768px以上のとき  |
| `lg:text-lg`   | 画面幅1024px以上のとき |

---

## 画面サイズのブレークポイント（デフォルト）

| 修飾子    | 最小幅(px) | 用途              |
| ------ | ------- | --------------- |
| `sm:`  | 640px〜  | スマホ横 or 小型タブレット |
| `md:`  | 768px〜  | タブレット           |
| `lg:`  | 1024px〜 | ノートPC           |
| `xl:`  | 1280px〜 | デスクトップ          |
| `2xl:` | 1536px〜 | 大画面             |

---

## 例①：モバイル → PCで変化するレイアウト

### 🔹 1カラム → 2カラムに変わる例

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
  <div className="bg-blue-300 p-6 rounded-lg">カード1</div>
  <div className="bg-blue-300 p-6 rounded-lg">カード2</div>
</div>
```

📱 スマホでは縦並び
💻 タブレット以上では横並びになります

---

## 例②：スマホでハンバーガーメニュー、PCで通常ナビ

```jsx
import { useState } from "react";

function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold">MySite</h1>

        {/* PCナビ */}
        <ul className="hidden md:flex gap-6">
          <li>ホーム</li>
          <li>ブログ</li>
          <li>お問い合わせ</li>
        </ul>

        {/* ハンバーガー（モバイル用） */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          ☰
        </button>
      </div>

      {/* モバイルメニュー */}
      {open && (
        <ul className="flex flex-col gap-2 mt-2 md:hidden">
          <li>ホーム</li>
          <li>ブログ</li>
          <li>お問い合わせ</li>
        </ul>
      )}
    </nav>
  );
}

export default NavBar;
```

* `md:hidden` → 中画面以上では非表示（スマホでのみ表示）
* `hidden md:flex` → スマホでは非表示、PCでは表示

---

## 例③：フォント・マージンを調整する

```jsx
<h1 className="text-2xl md:text-4xl font-bold mt-4 md:mt-8">
  スマホでも読みやすいタイトル
</h1>
```

---

## 例④：画像サイズをレスポンシブ対応に

```jsx
<img
  src="/hero.jpg"
  className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-lg"
/>
```

---

## コツまとめ

| やりたいこと         | Tailwindの書き方                |
| -------------- | --------------------------- |
| スマホだけ非表示       | `hidden sm:block`           |
| PCだけ非表示        | `block sm:hidden`           |
| スマホで縦並び、PCで横並び | `flex flex-col md:flex-row` |
| スマホ小文字・PC大文字   | `text-sm md:text-lg`        |

---
