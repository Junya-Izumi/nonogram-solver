//共通する型や関数を書く

//マスの情報
//0 何も状態
//1　×が打たれた状態
//2　塗られた状態
export type Cell = 0 | 1 | 2;

export function isCell(value:unknown):value is Cell{
    return (
        value != null &&
        typeof value == "number" &&
        [0,1,2].includes(value)
    )
}

//値参照用の型
export const CellValues = {
    Empty : 0,
    Cross : 1,
    Filled : 2
} as const 

//ノノグラムの二次元配列の型
export type Board = Cell[][];

//Boardの情報の型
export type BoardInfo = {
    width:number
    height:number
}

//座標の指定に使う型
export type Position = {
    x:number,
    y:number
};

//ヒントの配列
export type Hint = {
    row:number[][]
    col:number[][]
}

//問題一つ分の情報
export type Nonogram = {
    hint:Hint,
    boardInfo:BoardInfo,
    solution?:Board,
    title?:string
}
//その行列が単体が解くことができたか
export type Solved = {
    row:boolean[],
    col:boolean[]
}
//更新があったときのリスナーに渡す情報
export type NewFill = {
    position:Position
    cell:Cell
}