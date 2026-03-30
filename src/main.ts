//ツールの実行

import { Solver } from "./solver";
import { sampleData2} from "./data/sample";
import { Viewer } from "./viewer/idnex";
import { qs } from "./utiles";
const solver = new Solver(sampleData2)
const viewer = new Viewer(solver,qs("#viewer") as HTMLElement)
const solveBtn = qs("#solve") as HTMLElement;
solveBtn.addEventListener("click",solver.solve.bind(solver))