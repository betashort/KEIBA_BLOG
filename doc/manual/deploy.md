# デプロイ手順（Xserver）

公開サイトは静的ファイルのみで動く。運用は **ローカルワンコマンド** とする。

- ビルド: Docker の `node` サービスで `npm run build`
- 転送: ホスト（Windows）から SFTP / SCP で Xserver の指定フォルダへ

設計上の成果物・Apache 設定は [アーキテクチャ設計書 §8](../03_design/architecture_design.md#8-デプロイ設計) を参照する。

## 1. 方針

| 項目 | 内容 |
| ---- | ---- |
| 実行場所 | 自分の PC（リポジトリルート） |
| エントリ | `.\tools\deploy\release.ps1` |
| ビルド | `docker compose exec` で `keiba-blog` の `npm run build` |
| 転送 | ホストの OpenSSH `scp` と `ssh`（Xserver の SSH / ポート 10022） |
| 対象 | `keiba-blog/dist/` の中身だけ |
| 認証 | SSH 公開鍵。接続情報はリポジトリに置かない |

`npm run build` に転送は混ぜない。コンテナへ SSH 鍵を渡さない。

```text
[ローカル]
  release.ps1
    ├─ docker compose で npm run build
    │     tsc → vite build → prerender → sitemap
    │     → keiba-blog/dist/
    └─ ホストの scp + ssh
          → 隣のフォルダへ転送し、公開ディレクトリと入れ替え
```

## 2. 何を出すか

`dist/` の **中身** でリモートの公開ディレクトリを丸ごと置き換える。`dist` という名前のフォルダごと置かない。削除した記事の HTML や古い `assets/` はサーバに残らない。

| 含める | 含めない |
| ------ | -------- |
| `index.html` / 各パスの `index.html` / `404.html` | `src/` / `scripts/` |
| `assets/`（JS / CSS） | `node_modules/` |
| `robots.txt` / `sitemap.xml` / 画像 | `.env` / `.env.deploy` |
| `.htaccess`（`public/.htaccess` がビルドで入る） | 設計書・Storybook 成果物 |

`VITE_SITE_ORIGIN` と `VITE_GA_MEASUREMENT_ID` は **ビルド時に `dist` へ埋め込まれる**。本番用の `keiba-blog/.env` でビルドした成果物だけを転送する。

## 3. 前提

- Docker Compose の `node` サービスが使えること（[開発環境](../dev_env/buildDevEnv.md)）
- 公開は **ドメイン直下**（`https://example.com/`）。サブディレクトリ公開にする場合は、この手順だけでは足りない（Vite の `base` とルーティングの変更が必要）
- Xserver で SSH が有効であること（サーバーパネル）。接続ポートは **10022**（22 ではない）
- リモートの公開ディレクトリが分かっていること。よくある形:

```text
/home/{サーバーID}/{ドメイン名}/public_html
```

- Windows に OpenSSH クライアント（`ssh` / `scp`）があること（Windows 10 以降は標準）

## 4. 初回セットアップ

一度だけ行う。

### 4.1 本番用環境変数

`keiba-blog/.env.example` を `keiba-blog/.env` にコピーし、本番値を入れる。`.env` は Git にコミットしない。

```env
VITE_SITE_ORIGIN=https://your-domain.example
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

未設定のままビルドすると OGP / sitemap のオリジンが `https://example.com` になる。GA は空なら計測しない。

### 4.2 Xserver の SSH

1. サーバーパネルで SSH を有効化する
2. ホスト側で鍵を作る（未作成なら）

```powershell
ssh-keygen -t ed25519 -f $env:USERPROFILE\.ssh\xserver_keiba -C "keiba-blog-deploy"
```

3. 公開鍵（`.pub`）を Xserver に登録する
4. 接続確認（ホスト名・ユーザーは契約情報に置き換える）

```powershell
ssh -p 10022 -i $env:USERPROFILE\.ssh\xserver_keiba YOUR_USER@svXXX.xserver.jp
```

### 4.3 転送用設定

`tools/deploy/.env.deploy` を作る。雛形は同じディレクトリの `.env.deploy.example`。**Git にコミットしない**。

```env
XSERVER_HOST=svXXX.xserver.jp
XSERVER_USER=YOUR_USER
XSERVER_PORT=10022
XSERVER_REMOTE_DIR=/home/YOUR_USER/your-domain.example/public_html/
XSERVER_SSH_KEY=C:\Users\YOU\.ssh\xserver_keiba
```

| 変数 | 必須 | 説明 |
| ---- | ---- | ---- |
| `XSERVER_HOST` | はい | SSH ホスト（例: `sv123.xserver.jp`） |
| `XSERVER_USER` | はい | SSH ユーザー（サーバー ID） |
| `XSERVER_PORT` | いいえ | 省略時 `10022` |
| `XSERVER_REMOTE_DIR` | はい | 公開ディレクトリの絶対パス。末尾スラッシュなし。**このサイト専用**であること |
| `XSERVER_SSH_KEY` | 推奨 | 秘密鍵のパス。省略時は ssh のデフォルト鍵 |

`XSERVER_REMOTE_DIR` はデプロイのたびにフォルダごと入れ替える。`public_html` 直下だと `.well-known` など別用途のファイルも消えるので、サイト専用のサブディレクトリ（例: `.../public_html/keiba-blog`）を指定する。

## 5. 日常の公開（ワンコマンド）

リポジトリルートで PowerShell を開く。

```powershell
.\tools\deploy\release.ps1
```

実行内容:

1. コンテナが止まっていれば `docker compose up -d`
2. `docker compose exec -T node sh -c "cd keiba-blog && npm run build"`
3. `keiba-blog/dist/index.html` があることを確認
4. `XSERVER_REMOTE_DIR.next` へ `dist/` の中身を転送する
5. ディレクトリ `755`・ファイル `644` に直し、公開ディレクトリと入れ替える（削除済み記事は残らない。SSH 経由の `700` による 403 を防ぐ）

ビルド済み `dist/` を出し直すだけなら:

```powershell
.\tools\deploy\release.ps1 -SkipBuild
```

コマンドだけ確認して送らない場合:

```powershell
.\tools\deploy\release.ps1 -DryRun
```

## 6. デプロイ後の確認

1. 本番ドメインで `/` が開くこと
2. 代表記事（ブログ / 予想など）が開くこと
3. 存在しない URL が `404.html`（NotFound）になること
4. `/sitemap.xml` と `/robots.txt` が返ること
5. 必要なら Google Search Console で sitemap を再送信する
6. GA を入れているときは [GA4 導入手順](../reference/GoogleAnalytics_React.md) の Realtime 確認

## 7. 注意事項

**古いハッシュ付きアセット**  
Vite は `assets/index-xxxxx.js` のようにファイル名を変える。公開ディレクトリを `dist/` で置き換えるため、前回デプロイの余剰ファイルは残らない。

**アップロード中の欠け**  
転送は公開パスの隣（`XSERVER_REMOTE_DIR.next`）で行い、権限を直してから `mv` で入れ替える。入れ替え直前まで旧ファイルが配信される。失敗したら同じコマンドを再実行する。

**Xserver の 403**  
SSH / `scp` で作ったディレクトリは `700` になり、Apache から読めず 403 になることがある。スクリプトは入れ替え前にディレクトリ `755`・ファイル `644` へ直す。

**ローカル用ビルドを本番へ出さない**  
`VITE_SITE_ORIGIN` が開発用のままの `dist/` は転送しない。

**`.htaccess` はリポジトリ側を正とする**  
`public/.htaccess` が `dist/.htaccess` に入る。サーバー上だけで直すと、次のデプロイで上書きされる。

**パスワードをファイルに書かない**  
鍵認証にする。`.env.deploy` と `keiba-blog/.env` はコミット対象外。

## 8. うまくいかないとき

| 症状 | 確認すること |
| ---- | ------------ |
| `.env.deploy がありません` | `tools/deploy/.env.deploy` があるか |
| `dist/index.html がありません` | ビルドが成功したか。`-SkipBuild` を付けていないか |
| `Permission denied` / 鍵エラー | `XSERVER_SSH_KEY`、公開鍵の登録、パスフレーズ付き鍵ならエージェント |
| 接続タイムアウト | ポートが **10022** か。SSH がパネルで有効か |
| ページは出るが CSS/JS が古い | ブラウザキャッシュ。または転送先が `public_html/dist` になっていないか（中身を直下へ出す） |
| `ssh に失敗しました` | ポート 10022、鍵、リモートパスの書き込み権限。`XSERVER_REMOTE_DIR.next` が残っていれば次の実行で消して作り直す |
| Xserver の 403 ページ | 公開ディレクトリが `755` / ファイルが `644` か。入れ替え後のデプロイをもう一度実行する |
| OGP / sitemap のドメインが違う | `keiba-blog/.env` の `VITE_SITE_ORIGIN` を直して再ビルド |
| `docker compose` が失敗する | リポジトリルートで実行しているか。`docker compose up -d` が通るか |

SSH が使えない契約のときは、同じ `dist/` を FTPS クライアントで指定フォルダへ手動アップロードする（平文 FTP は使わない）。日常運用の正はワンコマンド側とする。

## 9. 関連

- [アーキテクチャ設計書 §8 デプロイ設計](../03_design/architecture_design.md#8-デプロイ設計)
- [開発環境（Docker / ビルド）](../dev_env/buildDevEnv.md)
- [Google Analytics 4 導入手順](../reference/GoogleAnalytics_React.md)
- スクリプト: `tools/deploy/release.ps1`
- 転送設定: `tools/deploy/.env.deploy`（雛形: `.env.deploy.example`）
