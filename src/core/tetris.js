export class Tetris {
    constructor(shape, topLeft) {
        this.color = shape.color;
        this.blocks = Object.assign([], shape.blocks);
        this.topLeft = topLeft;
    }
}

export class Shape {

    static Q = Object.freeze({
        blocks: [
            [1, 1],
            [1, 1]
        ],
        color: '#4e7fff'
    })

    static L = Object.freeze({
        blocks: [
            [1, 0],
            [1, 0],
            [1, 1]
        ],
        color: '#ffa2e4'
    })

    static J = Object.freeze({
        blocks: [
            [0, 1],
            [0, 1],
            [1, 1]
        ],
        color: '#0f801f'
    })

    static T = Object.freeze({
        blocks: [
            [0, 1, 0],
            [1, 1, 1]
        ],
        color: '#ffe67a'
    })

    static I = Object.freeze({
        blocks: [
            [1, 1, 1, 1]
        ],
        color: '#b8251f'
    })

    static S = Object.freeze({
        blocks: [
            [0, 1, 1],
            [1, 1, 0]
        ],
        color: '#da3aff'
    })

    static Z = Object.freeze({
        blocks: [
            [1, 1, 0],
            [0, 1, 1]
        ],
        color: '#9adeff'
    })
}
