import Event from './event';
import Engine from './engine';

export default class Stage {

    constructor(width, height) {
        const grid = Array(height).fill(0);
        for (let r = 0; r < height; r++) {
            grid[r] = Array(width).fill(0);
        }
        this.engine = new Engine(grid);
    }

    setTetris(tetris) {
        this.tetris = tetris;
    }

    dispatch(event) {
        switch (event) {
            case Event.LEFT:
            case Event.RIGHT:
            case Event.DOWN:
                this.move(event);
                break;
            case Event.ROTATE:
                this.rotate(event);
                break;
            case Event.FALL:
                this.fall();
                break;
            default:
                console.warn(`Unknown event: ${event}`);
        }
    }

    move = (event) => {
        if (!this.engine.isBlocked(this.tetris.topLeft, this.tetris.blocks, event.pos)) {
            this.tetris.topLeft[0] += event.pos[0];
            this.tetris.topLeft[1] += event.pos[1];
        }
        this.settle();
    };

    rotate = (event) => {
        const after = this.engine.rotate(this.tetris);
        if (!this.engine.isBlocked(this.tetris.topLeft, after, event.pos)) {
            this.tetris.blocks = after;
        }
        this.settle();
    };

    fall = () => {
        const fr = this.engine.fall(this.tetris);
        if (fr <= 0) throw 'Game Over!';

        this.turnover(fr);
    };

    settle = () => {
        const fr = this.engine.fall(this.tetris);
        if (fr <= 0) throw 'Game Over!';

        // if the deepest row is equal to the current row, it is means that the tetris
        // can not move down any more and it should be digested
        if (fr === this.tetris.topLeft[0]) {
            this.turnover(fr);
        }
    };

    turnover = (fr) => {
        this.engine.digest(this.tetris, fr);

        // check if the rows can be erased
        for (let r = fr; r < fr + this.tetris.blocks.length; r++) {
            if (this.engine.canErase(r)) {
                // shift the blocks
                this.engine.shift(r);
            }
        }

        this.setTetris(null);
    }
}
