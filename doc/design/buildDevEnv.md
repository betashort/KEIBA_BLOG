# 構築
1. [docker 開発環境構築](#docker-開発環境構築)
2. [ビルドコマンド](#ビルドコマンド)
3. [プロジェクトを作成する](#プロジェクトを作成する)
4. [ライブラリ](#ライブラリ)
   1. [react-router-dom](#react-router-dom)
   2. [tailwindをインストールする](#tailwindをインストールする)
   3. [MUIのインストール](#muiのインストール)
   4. [Drawer](#drawer)
   5. [axio](#axio)
   6. [fullcalendar](#fullcalendar)

## docker 開発環境構築

```bash
docker-compose up -d
docker-compose exec node bash
```

## ビルドコマンド

```bash
npm run dev
```

```bash
npm run build
```

## プロジェクトを作成する

```bash
npm create vite@latest keiba-blog --template react-ts
```

## ライブラリ

* react-router-dom
* gray-matter
* react-markdown

```bash
npm install gray-matter react-markdown
npm install react-router-dom
```

### react-router-dom

* https://www.npmjs.com/package/react-router-dom

```bash
npm i react-router-dom
```

### tailwindをインストールする

* https://tailwindcss.com/docs/guides/create-react-app

1. tailwind cssのインストールと初期化

```bash
npm i -D tailwindcss
npx tailwindcss init
```

2. tailwind.config.jsの編集

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

3. index.cssの編集

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### MUIのインストール

```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
```

### Drawer

* https://mui.com/material-ui/react-drawer/

### axio
```bash
npm i axios
```

### fullcalendar
```bash
npm install @fullcalendar/react @fullcalendar/core @fullcalendar/daygrid
```