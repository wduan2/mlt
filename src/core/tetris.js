export class Tetris {
    constructor(shape, topLeft) {
        this.color = shape.color;
        this.blocks = Object.assign([], shape.blocks);
        this.topLeft = topLeft;
    }
}

export class Factory {

    static nextTetris(initTopLeft) {
        const shapeName = this.nextShapeName();
        const shape = Shape[shapeName];
        return new Tetris(shape, initTopLeft);
    }

    static nextShapeName() {
        const sides = Object.getOwnPropertyNames(Shape);
        const index = Math.floor(Math.random() * sides.length);
        return sides[index];
    }
}

export const Shape = {

    Q: Object.freeze({
        blocks: [
            [1, 1],
            [1, 1]
        ],
        color: '#4e7fff'
    }),

    L: Object.freeze({
        blocks: [
            [1, 0],
            [1, 0],
            [1, 1]
        ],
        color: '#ffa2e4'
    }),

    J: Object.freeze({
        blocks: [
            [0, 1],
            [0, 1],
            [1, 1]
        ],
        color: '#0f801f'
    }),

    T: Object.freeze({
        blocks: [
            [0, 1, 0],
            [1, 1, 1]
        ],
        color: '#ffe67a'
    }),

    I: Object.freeze({
        blocks: [
            [1, 1, 1, 1]
        ],
        color: '#b8251f'
    }),

    S: Object.freeze({
        blocks: [
            [0, 1, 1],
            [1, 1, 0]
        ],
        color: '#da3aff'
    }),

    Z: Object.freeze({
        blocks: [
            [1, 1, 0],
            [0, 1, 1]
        ],
        color: '#9adeff'
    })
}
