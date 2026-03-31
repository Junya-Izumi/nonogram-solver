//canvas処理をまとめるモジュール
import { CellValues, type NewFill } from "../types";
import { qs } from "../utiles";
import { Viewer } from "./";

export function setCanvasSize(viewer:Viewer) {
    const rowHint = qs(".rowHint",viewer.root);
    const colHint = qs(".colHint",viewer.root); 
    if (!(rowHint && colHint)) return;
    // if(!rowHint)return;
    viewer.board.height = 300 * window.devicePixelRatio * 2
    viewer.board.width = 300 * window.devicePixelRatio * 2
    viewer.cellSize = {
        height:(viewer.board.height / viewer.solver.nonogram.boardInfo.height),
        width:(viewer.board.width / viewer.solver.nonogram.boardInfo.width)
    }
}

export function canvasFill(viewer:Viewer,newFill:NewFill) {
    //表示方法の分岐
    if (newFill.cell !== CellValues.Cross) {
        let fillColor:string = "#353e5c"
        if (newFill.cell  == CellValues.Empty) {
            fillColor = "#FFF"
        }
        viewer.boardCtx.fillStyle = fillColor
        viewer.boardCtx.strokeStyle = fillColor
        viewer.boardCtx.fillRect(viewer.cellSize.width * newFill.position.x,viewer.cellSize.height * newFill.position.y,viewer.cellSize.width,viewer.cellSize.height)
    }else{
        //クロスを書く
        viewer.boardCtx.beginPath()
        viewer.boardCtx.fillStyle = "#000000"
        viewer.boardCtx.strokeStyle = "#000000"
        viewer.boardCtx.lineWidth = 2
        //左上から右下に線を引く
        viewer.boardCtx.moveTo(viewer.cellSize.width * newFill.position.x,viewer.cellSize.height * newFill.position.y)
        viewer.boardCtx.lineTo(viewer.cellSize.width * newFill.position.x + viewer.cellSize.width,viewer.cellSize.height * newFill.position.y + viewer.cellSize.height)
        //右上から左下に線を引く
        viewer.boardCtx.moveTo(viewer.cellSize.width * newFill.position.x + viewer.cellSize.width,viewer.cellSize.height * newFill.position.y)
        viewer.boardCtx.lineTo(viewer.cellSize.width * newFill.position.x,viewer.cellSize.height * newFill.position.y + viewer.cellSize.height)
        viewer.boardCtx.stroke()
        viewer.boardCtx.closePath()
    }
    fillCanvasBorderLine(viewer)
}

//ボーダー線を引く
export function fillCanvasBorderLine(viewer:Viewer) {
    //row
    viewer.boardCtx.beginPath()
    viewer.boardCtx.fillStyle = "#000"
    viewer.boardCtx.strokeStyle = "#000"
    viewer.boardCtx.lineWidth = 5;
    for (let i = 0; i < viewer.solver.nonogram.boardInfo.height +1; i++) {
        viewer.boardCtx.moveTo(0,viewer.cellSize.height * i)
        viewer.boardCtx.lineTo(viewer.board.width,viewer.cellSize.height * i)
        // viewer.boardCtx.closePath()
    }
    //col
    for (let i = 0; i < viewer.solver.nonogram.boardInfo.width +1; i++) {
        // viewer.boardCtx.beginPath()
        viewer.boardCtx.moveTo(viewer.cellSize.width * i,0)
        viewer.boardCtx.lineTo(viewer.cellSize.width * i,viewer.board.height)
    }
    viewer.boardCtx.stroke()
    viewer.boardCtx.closePath()
}