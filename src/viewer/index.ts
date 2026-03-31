//ノノグラムを表示するモジュール

import type { Solver } from "../solver";
import type { NewFill } from "../types";
import { qsAll } from "../utiles";
import { canvasFill, fillCanvasBorderLine, setCanvasSize } from "./canvasUtils";

export class Viewer {
    solver:Solver
    root:HTMLElement
    board:HTMLCanvasElement
    boardCtx:CanvasRenderingContext2D
    cellSize:{width:number,height:number}
    constructor(solver:Solver,outputElement:HTMLElement) {
        this.solver = solver
        this.root = outputElement
        this.board = document.createElement("canvas")
        this.boardCtx = this.board.getContext("2d")!
        this.cellSize = {
            height:Math.floor(this.board.height / this.solver.nonogram.boardInfo.height),
            width:Math.floor(this.board.width / this.solver.nonogram.boardInfo.width)
        }
        console.log(this.root)
        this.init()
        // this.output()
        this.solver.addChangeLisner(this.output.bind(this))
        this.drowBoard()
    }
    //rootの中に必要な要素を入れていく
    init(){
        const rowHint = document.createElement("div")
        const colHint = document.createElement("div")

        
        //クラス名をつける
        rowHint.classList.add("rowHint")
        colHint.classList.add("colHint")
        this.board.classList.add("board")
        
        //cssに幅を伝える
        this.root.style.setProperty('--viewer-height', this.solver.nonogram.boardInfo.height.toString());
        this.root.style.setProperty('--viewer-width', this.solver.nonogram.boardInfo.width.toString());
        
        //rowHint
        for (const hint of this.solver.nonogram.hint.row) {
            const row = document.createElement("div")
            row.textContent = hint.toString()
            rowHint.appendChild(row)
        }
        
        //colHint
        for (const hint of this.solver.nonogram.hint.col) {
            const col = document.createElement("div")
            col.textContent = hint.toString().replaceAll("," , "\n")
            // col.appendChild(col)
            colHint.appendChild(col)
        }

        
        //順番に入れる
        this.root.appendChild(document.createElement("div"))
        this.root.appendChild(colHint)
        this.root.appendChild(rowHint)
        this.root.append(this.board)
        
        //board
        setCanvasSize(this)
        fillCanvasBorderLine(this)
        
    }
    //データ表示する
    output(newFill:NewFill){
        //rowHint
        
        const rowHints = qsAll(".rowHint div",this.root)
        if (!(rowHints == null)){
            // rowHints[newFill.position.y].dataset.solved = String(this.solver.solved.col[newFill.position.y])
            rowHints.forEach((element,index)=>{
                if (element.dataset.solved !== String(this.solver.solved.row[index])) {
                    element.dataset.solved = String(this.solver.solved.row[index])
                }
            })
        };

        //colHint
        const colHints = qsAll(".colHint div",this.root)
        if (!(colHints == null)){
            colHints.forEach((element,index)=>{
                if (element.dataset.solved !== String(this.solver.solved.col[index])) {
                    element.dataset.solved = String(this.solver.solved.col[index])
                }
            })
        };
        // //board
        if (newFill) {
            canvasFill(this,newFill)
        }
    }
    drowBoard(){
        this.boardCtx.clearRect(0,0,this.board.width,this.board.height)
        setCanvasSize(this)
        fillCanvasBorderLine(this)
        for (let y = 0; y < this.solver.nonogram.boardInfo.height; y++) {
            for (let x = 0; x < this.solver.nonogram.boardInfo.width; x++) {
                const cellInfo:NewFill ={
                    position:{
                        y:y,
                        x:x
                    }, 
                    cell:this.solver.board[y][x]
                } 
                canvasFill(this,cellInfo)
                // if (cellInfo.position.y == 0&&
                //     cellInfo.position.x == 1
                // ) {
                //     console.log(cellInfo)
                // }
            }
        }
        requestAnimationFrame(this.drowBoard.bind(this))
    }
}