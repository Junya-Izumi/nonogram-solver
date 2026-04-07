//solver内の共通関数

import type { Solver } from ".";
import { CellValues, debug, type Cell } from "../types";

//列方向の1列を配列にして返す
export function getColArray(solver: Solver, col: number): Cell[] {
    const array: Cell[] = []
    for (let i = 0; i < solver.nonogram.boardInfo.height; i++) {
        array.push(solver.board[i][col])
    }
    return array
}

//hintと一致するなら空白をCellValues.Crossで埋め、solvedをtrueにする
export function solvedCheck(solver: Solver) {
    
    const EmptyToCross = (array: Cell[]) => {
        return array.map((value) => {
            if (value == CellValues.Empty) {
                return CellValues.Cross
            } else {
                return value
            }
        })
    }
    //row
    if(debug) console.group("row")
    for (let i = 0; i < solver.nonogram.boardInfo.height; i++) {
        if(debug) console.group(i)
        if (solver.solved.row[i]) {
            if(debug) console.groupEnd()
            continue
        }
        if (checkLine(solver.nonogram.hint.row[i], solver.board[i])) {
            const newArray = EmptyToCross(solver.board[i])
            solver.fillLine("row", i, newArray)
            solver.solved.row[i] = true
        }
        if(debug) console.groupEnd()
    }
    if(debug) console.groupEnd()
    //col
    if(debug) console.group("col")
    for (let i = 0; i < solver.nonogram.boardInfo.width; i++) {
        if(debug) console.group(i)
        if (solver.solved.col[i]) {
            if(debug) console.groupEnd()
            continue
        }
        const array: Cell[] = getColArray(solver, i)
        if (checkLine(solver.nonogram.hint.col[i], array)) {
            //CellValues.Crossで埋めた新しい配列
            const newArray = EmptyToCross(array)
            solver.fillLine("col", i, newArray)
            solver.solved.col[i] = true
        }
        if(debug) console.groupEnd()
    }
    if(debug) console.groupEnd()
}

//ヒントと配列があっているか確かめる関数
export function checkLine(hint: number[], array: Cell[]){
    const blocks: number[] = []
    let count = 0
    //CellValue.Filledが連続数を記録する
    for (const cell of array) {
        if (cell === CellValues.Filled) {
            count++
        } else if (count > 0) {
            blocks.push(count)
            count = 0
        }
    }
    if(debug) console.log({ blocks: blocks, hint: hint })
    if (count > 0) blocks.push(count);
    if (blocks.length !== hint.length) return false;
    for (let i = 0; i < hint.length; i++) {
        if (blocks[i] !== hint[i]) return false;
    }
    return true;
}

//ヒントとあっている部分は両サイドにcrossを入れる関数
// export function fillCrossBlockSide(solver:Solver) {
//     if(debug) console.group("fillCrossBlockSide")
//     //row
//     if(debug) console.group("row")
//     for (let i = 0; i < solver.nonogram.boardInfo.height; i++) {
//         const blocks:number[] = []
//         let count = 0
//         //CellValue.Filledが連続数を記録する
//         for (const cell of solver.board[i]) {
//             if (cell == CellValues.Filled) {
//                 count++
//             } else if (count > 0) {
//                 blocks.push(count)
//                 count = 0
//             }
//         }
//         blocks.forEach((blockLenght,index)=>{
//             if(solver.solved.row[index])return;
//             if(solver.nonogram.hint.row[i][index]==undefined)return;
//             if (solver.nonogram.hint.row[i][index] == blockLenght) {
//                 console.log(index,solver.nonogram.hint.row[i][index],blockLenght,solver.nonogram.hint.row[i])
//             }
//         })
//     }
//     if(debug) console.groupEnd()
//     //col
//     if(debug) console.group("col")
//     for (let i = 0; i < solver.nonogram.boardInfo.width; i++) {
//         const blocks:number[] = []
//         let count = 0
//         //CellValue.Filledが連続数を記録する
//         for (const cell of getColArray(solver,i)) {
//             if (cell == CellValues.Filled) {
//                 count++
//             } else if (count > 0) {
//                 blocks.push(count)
//                 count = 0
//             }
//         }
//         blocks.forEach((blockLenght,index)=>{
//             if(solver.solved.col[index])return;
//             if(solver.nonogram.hint.col[i][index]==undefined)return;
//             if (solver.nonogram.hint.col[i][index] == blockLenght) {
//                 console.log(index,solver.nonogram.hint.col[i][index],blockLenght,solver.nonogram.hint.col[i])
//             }
//         })
//     }
//     if(debug) console.groupEnd()
//     if(debug) console.groupEnd()
// }

//solve()で多用する繰り返しの共通する部分を関数化
export function forUnsolvedRows(groupName: string = "", solver: Solver, callback: Function) {
    if(debug) console.groupCollapsed(groupName)
    for (let i = 0; i < solver.nonogram.boardInfo.height; i++) {
        // if(debug) console.groupCollapsed(i)
        if (solver.solved.row[i]) {
            if(debug) console.log(i, "solved")
            // if(debug) console.groupEnd()
            continue
        };
        if (!callback(i)) {
            if(debug) console.log(i, "not apply")
        }
        // if(debug) console.groupEnd()
    }
    if(debug) console.groupCollapsed("solvedCheck")
    solvedCheck(solver)
    if(debug) console.groupEnd()
    if(debug) console.groupEnd()
    // fillCrossBlockSide(solver)
}

export function forUnsolvedCols(groupName: string = "", solver: Solver, callback: Function) {
    if(debug) console.groupCollapsed(groupName)
    for (let i = 0; i < solver.nonogram.boardInfo.width; i++) {
        // if(debug) console.groupCollapsed(i)
        if (solver.solved.col[i]) {
            if(debug) console.log(i, "solved")
            // if(debug) console.groupEnd()
            continue
        };
        if (!callback(i)) {
            if(debug) console.log(i, "not apply")
        }
        // if(debug) console.groupEnd()
    }
    if(debug) console.groupCollapsed("solvedCheck")
    solvedCheck(solver)
    if(debug) console.groupEnd()
    if(debug) console.groupEnd()
    // fillCrossBlockSide(solver)
}

export function forUnsolvedLine(groupName: string = "", solver: Solver, callback: Function) {
    if(debug) console.groupCollapsed(groupName)
    if(debug) console.groupCollapsed("row")
    for (let i = 0; i < solver.nonogram.boardInfo.height; i++) {
        if (solver.solved.row[i]) {
            if(debug) console.log(i, "solved")
            continue
        };
        if (!callback("row","height",i)) {
            if(debug) console.log(i, "not apply")
        }
    }
    if(debug) console.groupEnd()
    if(debug) console.groupCollapsed("col")
    for (let i = 0; i < solver.nonogram.boardInfo.width; i++) {
        if (solver.solved.col[i]) {
            if(debug) console.log(i, "solved")
            continue
        };
        if (!callback("col","width",i)) {
            if(debug) console.log(i, "not apply")
        }
    }
    if(debug) console.groupEnd()
    if(debug) console.groupCollapsed("solvedCheck")
    solvedCheck(solver)
    if(debug) console.groupEnd()
    if(debug) console.groupEnd()
}