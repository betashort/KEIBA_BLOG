FROM node:22-alpine

# bash: 対話シェル / chromium + CJK フォント: UI設計スクリーンショット撮影
RUN apk add --no-cache \
    bash \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    font-noto-cjk

ENV PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

WORKDIR /projects

EXPOSE 5173
EXPOSE 6006