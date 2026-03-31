//ツールの実行

import { Solver } from "./solver";
import { Viewer } from "./viewer";
import { sampleData2 } from "./data/sample";
import { qs } from "./utiles";//document.querySelector()の短縮

const solver = new Solver(sampleData2)
const viewer = new Viewer(solver,qs("#viewer")!)
const solveBtn = qs("#solve")!
solveBtn.addEventListener("click",()=>solver.solve())