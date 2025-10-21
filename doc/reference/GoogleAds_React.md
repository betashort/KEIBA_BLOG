# Reactの静的サイトにGoogleAdsを貼る方法

1. [✅ 前提：Google AdSense でサイトを登録し、広告ユニットのコードを取得しておいてください。](#-前提google-adsense-でサイトを登録し広告ユニットのコードを取得しておいてください)
2. [📦 手順](#-手順)
   1. [① `index.html` にスクリプト追加（Vite の場合）](#-indexhtml-にスクリプト追加vite-の場合)
   2. [② Reactコンポーネントの作成](#-reactコンポーネントの作成)
   3. [③ 使用方法](#-使用方法)
3. [⚠️ 注意点](#️-注意点)

---

* `Vite + React + TypeScript` で Google AdSense の広告を表示するには、AdSense のスクリプトを読み込み、広告用の `<ins>` タグを挿入するコンポーネントを作成する必要があります。

---

## ✅ 前提：Google AdSense でサイトを登録し、広告ユニットのコードを取得しておいてください。

例：

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx"
     crossorigin="anonymous"></script>
```

---

## 📦 手順

### ① `index.html` にスクリプト追加（Vite の場合）

```html
<!-- public/index.html -->
<head>
  ...
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx"
    crossorigin="anonymous"></script>
</head>
```

このスクリプトは Vite の場合、`public/index.html` の `<head>` に追加してください。

---

### ② Reactコンポーネントの作成

```tsx
// components/AdSense.tsx
import { useEffect, useRef } from 'react';

type AdSenseProps = {
  adSlot: string;
  adFormat?: string;
  adLayout?: string;
  fullWidthResponsive?: boolean;
};

export const AdSense: React.FC<AdSenseProps> = ({
  adSlot,
  adFormat = 'auto',
  adLayout = '',
  fullWidthResponsive = true,
}) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if ((window as any).adsbygoogle && adRef.current) {
        (window as any).adsbygoogle.push({});
      }
    } catch (e) {
      console.error('Adsense error:', e);
    }
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-layout={adLayout}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
        ref={adRef}
      ></ins>
    </div>
  );
};
```

---

### ③ 使用方法

```tsx
// pages/Blog.tsx などで
import { AdSense } from '../components/AdSense';

export const Blog = () => {
  return (
    <div>
      <h1>ブログ記事</h1>

      <AdSense adSlot="1234567890" />

      <p>記事の内容...</p>
    </div>
  );
};
```

---

## ⚠️ 注意点

1. **広告が表示されない場合**

   * AdSense による審査が完了していない
   * テスト広告でない場合、本番ドメインでしか表示されない
   * JavaScript のエラーや広告ブロッカーの影響

2. **広告テストしたい場合**
   `data-adtest="on"` 属性を `<ins>` に追加して開発中は使えます。

   ```tsx
   data-adtest="on"
   ```

---

必要であれば、レスポンシブ広告、横長・縦長バナーなども対応できます。ご希望あれば追加でご案内します！
