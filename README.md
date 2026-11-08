# 北豊中友好会 ホームページ

豊中市の中学軟式野球チーム「北豊中友好会」の静的サイトです。GitHub Pages で公開できます。

## 公開手順

1. このフォルダの中身を GitHub リポジトリにアップロードする。
2. リポジトリの Settings → Pages を開く。
3. Branch を `main`、フォルダを `/ (root)` にして保存する。
4. 表示された URL を開く。

## ページ

- `index.html` ホーム（募集、試合、予定、Instagram）
- `about.html` チーム概要
- `roster.html` 選手
- `results.html` 試合結果
- `schedule.html` 2026年10月の予定
- `news.html` ニュース
- `join.html` 入団案内
- `grounds.html` グラウンド
- `pathways.html` 進路
- `contact.html` 連絡先
- `privacy.html` 個人情報保護方針

## 更新のしかた

文章は各 HTML を直接編集します。10月以降の予定は `schedule.html` と `index.html` の予定一覧を書き換えます。試合は `results.html` の表に行を足します。

## ホームの写真

`images` フォルダに、次のファイル名で写真を置くと、ホーム上部のスライドショーに表示されます。写真が1枚もないときは、紺とゴールドの空きスペースのままです。

- `images/hero.jpg` … 1枚目
- `images/gallery-1.jpg` … 練習
- `images/gallery-2.jpg` … 試合
- `images/gallery-3.jpg` … 合宿
- `images/gallery-4.jpg` … グラウンド
- `images/gallery-5.jpg` … チーム

横長の写真が、枠いっぱいに収まります。2枚以上あると、約5秒ごとに切り替わります。

## Instagram

ホームの「活動のいま」は、公式アカウント [instagram.com/kitatoyonaka55](https://www.instagram.com/kitatoyonaka55/) へつながります。新しい投稿は Instagram 側に上がると、そのプロフィールで最新の並びになります。

写真がホームページ内に並ぶグリッドにしたい場合は、LightWidget や SnapWidget でウィジェットを作り、発行された iframe の URL を `js/main.js` の `widgetSrc` に貼ってください。空のままなら、プロフィールを開くボタンを表示します。

## 連絡先について

掲載メールは、現行サイトのトップと入団案内にある `kitatoyonaka.post@gmail.com` です。連絡先ページだけ `gmil.com` となっていたため、そちらは誤記として採用していません。
