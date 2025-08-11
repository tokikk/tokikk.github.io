## 今日は祝日？

アクセス日が祝日であれば祝日名を表示するシンプルなWebアプリです。

- データ取得と公開: GitHub Actions + GitHub Pages（`docs/holidays.json`）
- フロントエンド: CDN版 Vue.js + Tailwind CSS（`web/` 配下を任意のWebサーバーに配置）

### セットアップ手順

1. リポジトリをGitHubに作成し、このコードをpush。
2. GitHub Pages を有効化
   - Settings → Pages → Source: `Deploy from a branch`
   - Branch: `main` / Folder: `/docs`
3. GitHub Actions の実行
   - Actions タブから "Fetch and publish holidays" を手動実行（または main への push / 週次スケジュールを待つ）
   - 成功すると `https://<your-username>.github.io/<your-repo>/holidays.json` が公開されます
4. フロントエンドの設定
   - `web/config.js` の `HOLIDAY_JSON_URL` を上記URLに変更
   - `web/` ディレクトリを任意のWebサーバーへデプロイ

### ローカルでデータ生成

```bash
npm ci
npm run fetch-holidays
```

`docs/holidays.json` が生成/更新されます。

### 補足

- 祝日CSVは内閣府配布の `syukujitsu.csv` を参照します。
- 祝日判定日は日本標準時（JST）で行います。


