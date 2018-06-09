import Event from './event';
import Engine from './engine';
import {Factory} from './tetris';

export default class Stage {

    /*
     * Represents the grids by a 2D array, the first index as the column
     * and the second index as the row
     *
     * the origin (0, 0) is the top-left corner of the grid
     *
     * if a cell of the grid is filled by a block then set it to 1 otherwise it remains 0
     */
    constructor(width, height, initTopLeft) {
        this.grid = Array(height).fill(0);
        for (let r = 0; r < height; r++) {
            this.grid[r] = Array(width).fill(0);
        }
        this.initTopLeft = initTopLeft;
        this.tetris = Factory.nextTetris(initTopLeft);
    }

    reduce(event) {
        let fr = -1;
        switch (event) {
            case Event.LEFT:
            case Event.RIGHT:
            case Event.DOWN:
                fr = this.move(event);
                break;
            case Event.ROTATE:
                fr = this.rotate(event);
                break;
            case Event.FALL:
                fr = this.fall();
                break;
            default:
                throw `Unknown event: ${event}`;
        }
        this.settle(fr);
    }

    move = (event) => {
        if (!Engine.isBlocked(this.tetris.topLeft, this.tetris.blocks, event.pos, this.grid)) {
            this.tetris.topLeft[0] += event.pos[0];
            this.tetris.topLeft[1] += event.pos[1];
        }
        return Engine.deepest(this.tetris, this.grid);
    };

    rotate = (event) => {
        const after = Engine.rotate(this.tetris);
        if (!Engine.isBlocked(this.tetris.topLeft, after, event.pos, this.grid)) {
            this.tetris.blocks = after;
        }
        return Engine.deepest(this.tetris, this.grid);
    };

    fall = () => {
        const fr = Engine.deepest(this.tetris, this.grid);
        this.tetris.topLeft[0] = fr;
        return fr;
    };

    settle = (fr) => {
        if (fr <= 0) throw 'Game Over!';

        // if the deepest row is equal to the current row, it is means that the tetris
        // can not move down any more and it should be digested
        if (fr === this.tetris.topLeft[0]) {
            Engine.digest(this.tetris, fr, this.grid);

            // check if the rows can be erased
            for (let r = fr; r < fr + this.tetris.blocks.length; r++) {
                if (Engine.canErase(r, this.grid)) {
                    // shift the blocks
                    Engine.shift(r, this.grid);
                }
            }

            this.tetris = Factory.nextTetris(this.initTopLeft);
        }
    };
}
