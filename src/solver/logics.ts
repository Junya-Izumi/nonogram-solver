//処理する関数の分割
import type { Solver } from ".";
import { type Cell, CellValues } from "../types";
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
            console.log(lineArray)
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
        console.log(direction,i,[...existingLine],allFillLine,solver.nonogram.hint[direction][i])
        if (checkLine(solver.nonogram.hint[direction][i], allFillLine)) {
            solver.fillLine(direction,i, allFillLine)
            solver.solved[direction][i] = true
            return true
        }
    })
}

// export function applyBothSide(solver:Solver) {
//     forUnsolvedLine("both side",solver,(direction:"row"|"col",dimension:"width"|"height",i:number)=>{
//         const getCell = (y:number,x:number):Cell=>{
//             if (direction == "row") {
//                 return solver.board[y][x]
//             }else{
//                 return solver.board[x][y]
//             }
//         }
//         if (getCell(i,0) == CellValues.Filled) {
//             for (let j = 0; j < solver.nonogram.hint[direction][i][0]; j++) {
//                 solver.fill({y:i,x:j},CellValues.Filled)
//             }
//             solver.board[i][solver.nonogram.hint[direction][i][0]] = CellValues.Cross
//         }
//         const boardLength = solver.nonogram.boardInfo[dimension]
//         const hintLength = solver.nonogram.hint[direction][i].length
//         // console.log(solver.board[i][length],solver.board[i],solver.board[i].length-1)
//         if (solver.board[i][boardLength-1] == CellValues.Filled) {
//             for (let j = 0; j < solver.nonogram.hint[direction][i][hintLength-1]; j++) {
//                 solver.fill({y:i,x:boardLength-1-j},CellValues.Filled)
//             }
//             if (direction == "row") {
//                 solver.fill({y:i,x:solver.nonogram.hint[direction][i][hintLength-1-1]},CellValues.Cross)
//             }else{
//                 solver.fill({y:solver.nonogram.hint[direction][i][hintLength-1],x:i},CellValues.Cross)
//             }
//             // solver.board[i][solver.nonogram.hint[direction][i][hintLength-1-1]] = CellValues.Cross
//         }
//         if (solver.board[0][i]) {
            
//         }
//     })
// }