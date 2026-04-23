//サンプルデータ
//sample data
import type { Hint, Nonogram } from "../../types";

const generateNonogramData = (hintData:Hint):Nonogram=>{
    return {
        hint:hintData,
        boardInfo:{
            width:hintData.col.length,
            height:hintData.row.length
        }
    }
}


 const sampleHint: Hint = {
    row: [
        [4],
        [4],
        [5],
        [4],
        [2, 2],
        [0],
    ],
    col: [
        [5],
        [5],
        [4],
        [5],
        [1, 1],
        [0],
    ]
}
export const sampleData1:Nonogram =  generateNonogramData(sampleHint)

const sampleHint2: Hint = {
    row: [
        [1,1],
        [1,1,1],
        [5],
        [5],
        [2],
    ],
    col: [
        [5],
        [3],
        [4],
        [2],
        [3],
    ]
}
export const sampleData2:Nonogram =  generateNonogramData(sampleHint2)

const sampleHint3: Hint = {
    row: [
        [1,3],
        [3],
        [4],
        [3],
        [1,3],
    ],
    col: [
        [1,2],
        [2],
        [5],
        [3,1],
        [3,1],
    ]
}
export const sampleData3:Nonogram =  generateNonogramData(sampleHint3)

const sampleHint4:Hint = {
    row:[
        [1,2],
        [2,1],
        [3],
        [2,1],
        [1,1]
    ],
    col:[
        [2,2],
        [1,1],
        [1],
        [1,1],
        [5],
    ]
}

export const sampleData4:Nonogram = generateNonogramData(sampleHint4)

const sampleHint5:Hint = {
    row:[
        [2,2],
        [1,1],
        [1],
        [1,1],
        [5],
    ],
    col:[
        [1,2],
        [2,1],
        [3],
        [2,1],
        [1,1]
    ]
}

export const sampleData5:Nonogram = generateNonogramData(sampleHint5)
