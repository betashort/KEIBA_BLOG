/** UI設計書と Storybook ストーリーの対応表 */

export type Viewport = {
  width: number;
  height: number;
};

export type ScreenshotEntry = {
  storyId: string;
  filename: string;
  label: string;
};

/** ページ設計書: ワイヤーフレーム直後に 1 枚挿入 */
export type PageScreenshotTarget = {
  kind: "page";
  docPath: string;
  entry: ScreenshotEntry;
};

/** 共通レイアウト: セクション末尾に複数枚挿入 */
export type CommonScreenshotTarget = {
  kind: "common";
  docPath: string;
  insertBefore: string;
  entries: ScreenshotEntry[];
};

export type ScreenshotTarget = PageScreenshotTarget | CommonScreenshotTarget;

export const DEFAULT_VIEWPORT: Viewport = {
  width: 390,
  height: 844,
};

export const UI_DESIGN_ROOT = "doc/03_design/UI_design";

export const SCREENSHOT_TARGETS: ScreenshotTarget[] = [
  {
    kind: "page",
    docPath: "home/home.md",
    entry: {
      storyId: "pages-home--default",
      filename: "home-storybook.png",
      label: "ホーム",
    },
  },
  {
    kind: "page",
    docPath: "blog/list.md",
    entry: {
      storyId: "pages-blog-list--default",
      filename: "blog-list-storybook.png",
      label: "ブログ一覧",
    },
  },
  {
    kind: "page",
    docPath: "blog/article.md",
    entry: {
      storyId: "pages-blog-article--default",
      filename: "blog-article-storybook.png",
      label: "ブログ記事",
    },
  },
  {
    kind: "page",
    docPath: "study/list.md",
    entry: {
      storyId: "pages-study-list--default",
      filename: "study-list-storybook.png",
      label: "競馬研究一覧",
    },
  },
  {
    kind: "page",
    docPath: "study/article.md",
    entry: {
      storyId: "pages-study-article--default",
      filename: "study-article-storybook.png",
      label: "競馬研究記事",
    },
  },
  {
    kind: "page",
    docPath: "analysis/list.md",
    entry: {
      storyId: "pages-analysis-list--default",
      filename: "analysis-list-storybook.png",
      label: "レース分析一覧",
    },
  },
  {
    kind: "page",
    docPath: "analysis/article.md",
    entry: {
      storyId: "pages-analysis-article--default",
      filename: "analysis-article-storybook.png",
      label: "レース分析記事",
    },
  },
  {
    kind: "page",
    docPath: "predict/list.md",
    entry: {
      storyId: "pages-predict-list--default",
      filename: "predict-list-storybook.png",
      label: "レース予想一覧",
    },
  },
  {
    kind: "page",
    docPath: "predict/article.md",
    entry: {
      storyId: "pages-predict-article--default",
      filename: "predict-article-storybook.png",
      label: "レース予想記事",
    },
  },
  {
    kind: "page",
    docPath: "profile/profile.md",
    entry: {
      storyId: "pages-profile--default",
      filename: "profile-storybook.png",
      label: "プロフィール",
    },
  },
  {
    kind: "page",
    docPath: "profile/hitokuchi-portfolio.md",
    entry: {
      storyId: "pages-profile-hitokuchi-portfolio--default",
      filename: "hitokuchi-portfolio-storybook.png",
      label: "一口馬主ポートフォリオ",
    },
  },
  {
    kind: "page",
    docPath: "profile/aiba-diary.md",
    entry: {
      storyId: "pages-profile-aiba-diary--default",
      filename: "aiba-diary-storybook.png",
      label: "愛馬日記",
    },
  },
  {
    kind: "page",
    docPath: "profile/baken-portfolio.md",
    entry: {
      storyId: "pages-profile-baken-portfolio--default",
      filename: "baken-portfolio-storybook.png",
      label: "馬券ポートフォリオ",
    },
  },
  {
    kind: "common",
    docPath: "common.md",
    insertBefore: "## 3. UI要素一覧",
    entries: [
      {
        storyId: "common-header--default",
        filename: "common-header-storybook.png",
        label: "Header",
      },
      {
        storyId: "common-sidenav--closed",
        filename: "common-sidenav-closed-storybook.png",
        label: "SideNav（閉）",
      },
      {
        storyId: "common-sidenav--open",
        filename: "common-sidenav-open-storybook.png",
        label: "SideNav（開）",
      },
      {
        storyId: "common-footer--default",
        filename: "common-footer-storybook.png",
        label: "Footer",
      },
    ],
  },
];
