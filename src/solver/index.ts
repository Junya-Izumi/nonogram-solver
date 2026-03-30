//ノノグラムを解読するモジュール
import type { Cell, Board, Nonogram, Position, BoardInfo, Solved, NewFill } from "../types";
import { CellValues, isCell } from "../types";
import { apply0, applyAllFill, applyCenter, applyjust, applyBtween1, } from "./logics";
import { forUnsolvedRows, solvedCheck } from "./utils";

export class Solver {
    nonogram: Nonogram
    board: Board
    solved: Solved
    completed: boolean
    changeLisner: Function[]
    constructor(nonogram: Nonogram) {
        this.nonogram = nonogram
        this.board = this.createEmptyBoard(this.nonogram.boardInfo)
        this.solved = this.createFalseSolved()
        this.completed = false;
        this.changeLisner = []
        console.log(this.board)
        console.log(this.nonogram.hint.row)
        console.log(this.nonogram.hint.col)
    }
    //CellValues.Emptyで埋めたBoardを作る関数
    createEmptyBoard(boardInfo: BoardInfo) {
        return Array.from({ length: boardInfo.height }, () => new Array(boardInfo.width).fill(CellValues.Empty))
    }
    //すべてfalseのSolvedを作る関数
    createFalseSolved() {
        const row = Array(this.nonogram.boardInfo.height).fill(false);
        const col = Array(this.nonogram.boardInfo.width).fill(false)
        const solved: Solved = {
            row: row,
            col: col
        }
        return solved
    }
    //1つのマスを埋める関数
    fill(postiion: Position, cell: Cell) {
        // await new Promise((resolve)=>setTimeout(resolve,3000))
        console.log("fill", postiion, cell)
        // if (!(this.board[postiion.y][postiion.x] == cell)) {
        // }
        this.board[postiion.y][postiion.x] = cell;
        const newFill: NewFill = {
            position: postiion,
            cell: cell
        }
        this.onChange(newFill)
        // alert()
    }
    //一つの行・列をCellまたはCell[]で埋める関数
    fillLine(direction: "row" | "col", index: number, fillValue: Cell[] | Cell) {
        console.group("fillLine", index)
        for (let i = 0; i < this.nonogram.boardInfo.width; i++) {
            let postiion: Position = { y: index, x: i }
            if (direction == "col") {
                postiion = { y: i, x: index }
            }
            this.fill(postiion, (() => {
                if (isCell(fillValue)) {
                    return fillValue
                } else {
                    return fillValue[i]
                };
            })())
        }
        console.groupEnd()
    }
    //解読開始
    async solve() {
        this.reset()
        const cycle = [
            apply0,
            applyjust,
            applyBtween1,
            applyCenter,
            applyAllFill,
            // applyBothSide
        ]
        for (let i = 0; i < 2; i++) {
            console.log("cysle", i + 1)
            cycle.forEach((func) => func(this))
        }
        //ヒントが0ならその行列をCellValues.Crossで埋める
        // apply0(this)
        //ヒントが幅と同じならその行列をCellValues.Filledで埋める
        // applyjust(this)
        //間の空白が１マスずつと仮定して幅とピッタリならヒント通りに埋める
        // applyBtween1(this)
        //その行列のヒントが一つで幅の半分より大きい場合は計算して行列の真ん中を埋める
        // applyCenter(this)
        //すべての空白を埋めたとき、ヒントとあっているか確かめる
        // applyAllFill(this)

        // 端が塗られているなら端から数えて塗る両端

        forUnsolvedRows("both side row left", this, (i: number) => {
            // console.log(i,this.board[i][0])
            if (this.board[i][0] == CellValues.Filled) {
                for (let j = 0; j < this.nonogram.hint.row[i][0]; j++) {
                    this.fill({ y: i, x: j }, CellValues.Filled)
                }
                this.fill({ y: i, x: this.nonogram.hint.row[i][0] }, CellValues.Cross)
            }
        })
        forUnsolvedRows("both side row right", this, (i: number) => {
            const boardLength: number = this.nonogram.boardInfo.width
            const hintLength: number = this.nonogram.hint.row[i].length
            const currentHint: number = this.nonogram.hint.row[i][hintLength - 1]
            // console.log(this.board[i][length],this.board[i],this.board[i].length-1)
            if (this.board[i][boardLength - 1] == CellValues.Filled) {
                for (let j = 0; j < this.nonogram.hint.row[i][hintLength - 1]; j++) {
                    this.fill({ y: i, x: boardLength - j }, CellValues.Filled)
                    // this.board[i][boardLength-j] = CellValues.Filled
                }
                this.fill({ y: i, x: boardLength - currentHint - 1 }, CellValues.Cross)
            }
        })
        //col

        solvedCheck(this)
        this.onChange()
    }
    //問題が解けたかチェック
    completeCheck() {
        if (!this.solved.col.includes(false) &&
            !this.solved.row.includes(false)
        ) {
            return true;
        } else {
            return false;
        }
    }
    addChangeLisner(func: Function) {
        this.changeLisner.push(func)
    }
    //リスナーを実行
    onChange(newFill?: NewFill) {
        this.changeLisner.forEach((func) => {
            func(newFill)
        })
    }
    reset() {
        this.board = this.createEmptyBoard(this.nonogram.boardInfo)
        this.solved = this.createFalseSolved()
        this.completed = false
    }
}