export class Tetris {
    constructor(shape, topLeft) {
        this.color = shape.color;
        this.blocks = Object.assign([], shape.blocks);
        // cut off reference
        this.topLeft = Object.assign([], topLeft);
    }
}

export class Factory {

    static nextTetris = (initTopLeft) => {
        const shapeName = Factory.nextShapeName();
        const shape = Shape[shapeName];
        return new Tetris(shape, initTopLeft);
    };

    static nextShapeName = () => {
        const sides = Object.getOwnPropertyNames(Shape);
        const index = Math.floor(Math.random() * sides.length);
        return sides[index];
    };
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
        color: '#AF7AC5'
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
        color: '#EC7063'
    }),

    S: Object.freeze({
        blocks: [
            [0, 1, 1],
            [1, 1, 0]
        ],
        color: '#D35400'
    }),

    Z: Object.freeze({
        blocks: [
            [1, 1, 0],
            [0, 1, 1]
        ],
        color: '#9adeff'
    })
}
