//処理する関数の分割
import type { Solver } from ".";
import { type Cell, CellValues , debug} from "../types";
import { forUnsolvedRows, forUnsolvedCols, checkLine, getColArray, forUnsolvedLine } from "./utils";

export function apply0(solver:Solver) {
    forUnsolvedLine("apply0",solver,(direction:"row"|"col",i:number)=>{
        if (solver.nonogram.hint[direction][i][0] == 0) {
            solver.fillLine(direction, i, CellValues.Cross)
            solver.solved[direction][i] = true
            return true;
        }
    })
}

export function applyjust(solver:Solver) {
    forUnsolvedLine("applyjust",solver,(direction:"row"|"col",i:number,dimension:"width"|"height")=>{
        if (solver.nonogram.hint[direction][i][0] == solver.nonogram.boardInfo[dimension]) {
            solver.fillLine(direction, i, CellValues.Filled)
            solver.solved[direction][i] = true;
            return true
        }
    })
}

export function applyBtween1(solver:Solver) {
    forUnsolvedLine("applyBtween1",solver,(direction:"row"|"col",i:number,dimension:"width"|"height")=>{
        if (!(solver.nonogram.hint[direction][i].length >= 2)) return;
        let sum = 0
        solver.nonogram.hint[direction][i].forEach((value: number) => { sum += value + 1 })
        sum--//一つ多いから引く
        if (sum == solver.nonogram.boardInfo[dimension]) {
            const lineArray: Cell[] = []//
            solver.nonogram.hint[direction][i].forEach((n) => {
                lineArray.push(...Array(n).fill(CellValues.Filled))
                lineArray.push(CellValues.Cross)
            })
            lineArray.pop()
            if(debug) console.log(lineArray)
            solver.fillLine(direction, i, lineArray)
            solver.solved[direction][i] = true;
            return true
        }
    })
}



//その行列のヒントが一つで幅の半分より大きい場合は計算して行列の真ん中を埋める
//row
export const applyCenterRow = (solver: Solver) => {
    forUnsolvedRows("center row", solver, (i: number) => {
        if (solver.nonogram.hint.row[i].length == 1 &&
            solver.nonogram.hint.row[i][0] > Math.ceil(solver.nonogram.boardInfo.width / 2)
        ) {
            //埋めるマスの数　式：ヒント-(幅-ヒント) ＝　埋めるマスの数
            const hint = solver.nonogram.hint.row[i][0]
            const fillCount = hint - (solver.nonogram.boardInfo.width - hint)
            const startX: number = hint - fillCount;
            for (let j = 0; j < fillCount; j++) {
                solver.fill({ x: startX + j, y: i }, CellValues.Filled)
            }
            return true;
        }
    })
}
//col
export const applyCenterCol = (solver: Solver) => {
    forUnsolvedCols("center col", solver, (i: number) => {
        if (solver.nonogram.hint.col[i].length == 1 &&
            solver.nonogram.hint.col[i][0] > Math.ceil(solver.nonogram.boardInfo.height / 2)
        ) {
            //埋めるマスの数　式：ヒント-(幅-ヒント) ＝　埋めるマスの数
            const hint = solver.nonogram.hint.col[i][0]
            const fillCount = hint - (solver.nonogram.boardInfo.height - hint)
            const startY: number = hint - fillCount;
            for (let j = 0; j < fillCount; j++) {
                solver.fill({ x: i, y: startY + j }, CellValues.Filled)
            }
            return true
        }
    })
}

// export const applyCenter = (solver: Solver) => {
//     applyCenterRow(solver)
//     applyCenterCol(solver)
// }

export function applyCenter(solver: Solver){
    forUnsolvedLine("center",solver,(direction:"row"|"col",i:number,dimension:"width"|"height")=>{
        if (solver.nonogram.hint[direction][i].length == 1 &&
            solver.nonogram.hint[direction][i][0] > Math.ceil(solver.nonogram.boardInfo[dimension] / 2)
        ) {
            //埋めるマスの数　式：ヒント-(幅-ヒント) ＝　埋めるマスの数
            const hint = solver.nonogram.hint[direction][i][0]
            const fillCount = hint - (solver.nonogram.boardInfo[dimension] - hint)
            const start: number = hint - fillCount;
            for (let j = 0; j < fillCount; j++) {
                if (direction == "row") {
                 solver.fill({ x: start + j, y: i }, CellValues.Filled)      
                }else{
                    solver.fill({ x: i, y: start + j }, CellValues.Filled)
                }
            }
            return true
        }
    })
}

export function applyAllFill(solver:Solver) {
    forUnsolvedLine("all fill",solver,(direction:"row"|"col",i:number)=>{
        const existingLine = (():Cell[]=>{
            if (direction == "row") {
                return solver.board[i]
            }else{
                return getColArray(solver,i)
            }
        })()
        const allFillLine = [...existingLine].map((cell: Cell) => {
            if (cell == CellValues.Empty) {
                return CellValues.Filled
            } else {
                return cell
            }
        })
        if(debug) console.log(direction,i,[...existingLine],allFillLine,solver.nonogram.hint[direction][i])
        if (checkLine(solver.nonogram.hint[direction][i], allFillLine)) {
            solver.fillLine(direction,i, allFillLine)
            solver.solved[direction][i] = true
            return true
        }
    })
}

export function applyBothSide(solver:Solver) {
    forUnsolvedRows("both side row left", solver, (i: number) => {
        // console.log(i,solver.board[i][0])
        const currentHint = solver.nonogram.hint.row[i][0]
        const rowArray = structuredClone(solver.board[i])
        if (rowArray[0] == CellValues.Filled) {
            for (let j = 0; j < currentHint; j++) {
                rowArray[j] = CellValues.Filled
            }
            rowArray[currentHint] = CellValues.Cross
            solver.fillLine("row",i,rowArray)
            return true
        }
    })
    forUnsolvedRows("both side row right", solver, (i: number) => {
        const boardLength: number = solver.nonogram.boardInfo.width
        const hintLength: number = solver.nonogram.hint.row[i].length
        const currentHint: number = solver.nonogram.hint.row[i][hintLength - 1]
        const rowArray = structuredClone(solver.board[i])
        // console.log(solver.board[i][length],solver.board[i],solver.board[i].length-1)
        if (solver.board[i][boardLength - 1] == CellValues.Filled) {
            for (let j = 0; j < solver.nonogram.hint.row[i][hintLength - 1]; j++) {
                rowArray[boardLength - 1 - j] = CellValues.Filled
                // solver.board[i][boardLength-j] = CellValues.Filled
            }
            rowArray[boardLength - currentHint - 1] = CellValues.Cross
            solver.fillLine("row",i,rowArray)
            return true
        }
    })
    //col
    forUnsolvedCols("both side col top",solver,(i: number)=>{
        const currentHint = solver.nonogram.hint.col[i][0]
        const colArray = getColArray(solver,i)
        if (colArray[0] == CellValues.Filled) {
            // console.log("hint",solver.nonogram.hint.col[i])
            for (let j = 0; j < currentHint; j++) {
                colArray[j] = CellValues.Filled 
            }
            colArray[currentHint] = CellValues.Cross
            solver.fillLine("col",i,colArray)
            return true
        }
    })

    forUnsolvedCols("both side col buttom",solver,(i: number)=>{
        const boardLength: number = solver.nonogram.boardInfo.height
        const hintLength  = solver.nonogram.hint.col[i].length
        const currentHint  = solver.nonogram.hint.col[i][hintLength - 1]
        const colArray = getColArray(solver,i)
        // console.log("hint",solver.nonogram.hint.col[i][hintLength -1])
        // console.log("cell",colArray[boardLength - 1])
        if (colArray[boardLength - 1] == CellValues.Filled) {
            for (let j = 0; j < currentHint; j++) {
                colArray[boardLength - currentHint + j] = CellValues.Filled
            }
            colArray[boardLength - currentHint - 1] = CellValues.Cross
            solver.fillLine("col", i, colArray)
            // console.log(colArray)
            return true
        }
    })
}
