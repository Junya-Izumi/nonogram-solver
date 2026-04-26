# nonogram-solver 
```bash
git clone https://github.com/Junya-Izumi/nonogram-solver.git
```
## 概要・使い方
Nonogram（ノノグラム）のパズルを自動で解くTypeScriptモジュールです。
5x5に対応しています
### 解法
`Solver.solve()` 現在の実装では以下の手順で解きます

これらの処理を数回繰り返して完成させる
- 0の列を埋める
- ヒントが一つで列の幅と一致する場合に埋める
- 間が1マスでぴったりな場合に埋める
- 行が1つしかない場合、重なる部分を埋める
- X以外をすべて埋めた時にヒントに合うなら埋める
- 端が埋まっている場合、端から数えて埋める

### デモ起動手順
1. 依存パッケージをインストール
    ```bash
    npm install
    ```
2. 開発サーバーを起動
    ```bash
    npm run dev
    ```

## 使い方
index.html 必要な要素
```html
<!-- viewer用のcss -->
<link rel="stylesheet" href="src/style.css">
<!-- viewerの出力先 -->
<div id="viewer"></div>
```
main.ts
```typescript
import { Solver } from "./solver";
import { Viewer } from "./viewer";
import { sampleData2 } from "./data/sample";
import { qs } from "./utiles";//document.querySelector()の短縮

const solver = new Solver(sampleData2)
const viewer = new Viewer(solver,qs("#viewer")!)
const solveBtn = qs("#solve")!
solveBtn.addEventListener("click",()=>solver.solve())
```
## LICENSE
MIT License
