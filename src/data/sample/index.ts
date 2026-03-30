//サンプルデータ
//sample data
import type { Hint, Nonogram } from "../../types";
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
export const sampleData1: Nonogram = {
    hint: sampleHint,
    boardInfo: {
        width: sampleHint.col.length,
        height: sampleHint.row.length
    }
}

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
export const sampleData2: Nonogram = {
    hint: sampleHint2,
    boardInfo: {
        width: sampleHint2.col.length,
        height: sampleHint2.row.length
    }
}

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
export const sampleData3: Nonogram = {
    hint: sampleHint3,
    boardInfo: {
        width: sampleHint3.col.length,
        height: sampleHint3.row.length
    }
}