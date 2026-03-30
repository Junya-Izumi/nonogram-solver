# nonogram-solver 
⚠️開発途中・未完成
```bash
git clone https://github.com/Junya-Izumi/nonogram-solver.git
```
## 概要・使い方
Nonogram（ノノグラム）のパズルを自動で解くTypeScriptモジュールです。
### 実装
言語:typescript

### 解法
`Solver.solve()` 現在の実装では以下の手順で解きます

これらの処理を数回繰り返して完成させる
- 0の列を埋める
- 列の幅がヒントと一致する場合に埋める
- 間が1マスでぴったりな場合に埋める
- 行が1つしかない場合、重なる部分を埋める
- X以外を埋めた時にヒントに合うなら埋める
- （未完成）端が埋まっている場合、端から数えて埋める
- （未完成）ヒントに合っている場合、両サイドにXをつける


### 起動手順
1. 依存パッケージをインストール
```bash
npm install
```
2. 開発サーバーを起動
```bash
npm run dev
```

## LICENSE
MIT License