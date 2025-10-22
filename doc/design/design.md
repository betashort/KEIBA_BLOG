# 競馬ブログ
1. [ページ一覧](#ページ一覧)
2. [ページUI](#ページui)
   1. [ホームページ](#ホームページ)
   2. [レース](#レース)
      1. [レース一覧](#レース一覧)
      2. [過去レース一覧](#過去レース一覧)
      3. [レース詳細](#レース詳細)
   3. [競馬勉強会](#競馬勉強会)
   4. [競馬ブログ](#競馬ブログ-1)
   5. [自己紹介](#自己紹介)
3. [記事の構成](#記事の構成)
   1. [フォルダ構成](#フォルダ構成)
      1. [ブログ記事](#ブログ記事)
      2. [研究レポート](#研究レポート)
      3. [レース予想](#レース予想)
   2. [レース回顧](#レース回顧)
4. [共通設計](#共通設計)
   1. [カード](#カード)
   2. [スライドショー](#スライドショー)

## ページ一覧

* ホームページ
  * base-url/
* 競馬ブログ
  * url/blog/
* 競馬勉強会
  * url/research/
* レース一覧
  * base-url/race/
* レース詳細
  * base-url/race-detail/
* 過去レース
  * base-url/past-race/
* 自己紹介
  * url/profile

## ページUI

### ホームページ

### レース

#### レース一覧

#### 過去レース一覧

#### レース詳細

### 競馬勉強会

### 競馬ブログ

### 自己紹介

## 記事の構成

### フォルダ構成

#### ブログ記事

```text
keiba-blog/
├── public/
│   └── image/
│       ├── blog/
│           └── hello/
|               └── hello.png
├── src/
│   ├── article
|        └── blog/
│              └── hello.md
```

#### 研究レポート

```text
keiba-blog/
├── public/
│   └── image/
│       ├── research/
│           └── hello/
|               └── hello.png
├── src/
│   ├── article
|       └── research/
│              └── hello.md
```

#### レース予想

```text
keiba-blog/
├── public/
│   └── image/
│       ├── race-predict/
│           └── 2025/
│                └── 20250716/
│                   └── hello/
|                       └── hello.png
├── src/
│   ├── article
|         └── race-predict/
│               └── 2025/
│                    └── 20250716/
│                          └── hello.md
```

### レース回顧

```text
keiba-blog/
├── public/
│   └── image/
│       ├── race-predict/
│           └── 2025/
│                └── 20250716/
│                   └── hello/
|                       └── hello.png
├── src/
│   ├── article
|         └── race-predict/
│               └── 2025/
│                    └── 20250716/
│                          └── hello.md
```

## 共通設計

### カード

### スライドショー
