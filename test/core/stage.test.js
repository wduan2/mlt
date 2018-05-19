import Event from '../../src/core/event';
import Stage from '../../src/core/stage';
import {Tetris, Shape} from '../../src/core/tetris'

const cmpGrids = (a, e) => {
    for (let r = 0; r < a.length; r++) {
        for (let c = 0; c < a[r].length; c++) {
            if (a[r][c] !== e[r][c]) {
                return false;
            }
        }
    }
    return true;
};

test('test dispatch', () => {
    const stage = new Stage(10, 10);
    stage.move = jest.fn();
    stage.rotate = jest.fn();
    stage.fall = jest.fn();

    stage.dispatch(Event.DOWN);
    expect(stage.move).toHaveBeenCalledTimes(1);

    stage.dispatch(Event.RIGHT);
    expect(stage.move).toHaveBeenCalledTimes(2);

    stage.dispatch(Event.LEFT);
    expect(stage.move).toHaveBeenCalledTimes(3);

    stage.dispatch(Event.ROTATE);
    expect(stage.rotate).toHaveBeenCalledTimes(1);

    stage.dispatch(Event.FALL);
    expect(stage.fall).toHaveBeenCalledTimes(1);
});

test('test move', () => {
    const stage = new Stage(5, 5);
    stage.fall = jest.fn();
    stage.settle = jest.fn();

    const s = new Tetris(Shape.S, [0, 0]);
    stage.setTetris(s);

    stage.move(Event.DOWN);
    expect(s.topLeft[0] === 1);
    expect(stage.settle).toHaveBeenCalledTimes(1);

    stage.move(Event.LEFT);
    expect(s.topLeft[1] === 0);
    expect(stage.settle).toHaveBeenCalledTimes(2);

    stage.move(Event.RIGHT);
    expect(s.topLeft[1] === 1);
    expect(stage.settle).toHaveBeenCalledTimes(3);
});

test('test move integration', () => {
    const stage = new Stage(5, 5);
    const s = new Tetris(Shape.S, [0, 0]);
    stage.setTetris(s);

    stage.move(Event.DOWN);
    stage.move(Event.LEFT);
    stage.move(Event.RIGHT);
    stage.move(Event.DOWN);
    stage.move(Event.DOWN);

    const after = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 1, 1, 0],
        [0, 1, 1, 0, 0]
    ];

    expect(cmpGrids(after, stage.engine.grid)).toBeTruthy();
    expect(stage.tetris).toBeNull();
});

test('test rotate', () => {
    const stage = new Stage(5, 5);
    const s = new Tetris(Shape.S, [0, 0]);
    stage.setTetris(s);

    stage.move(Event.DOWN);
    stage.move(Event.DOWN);
    stage.rotate(Event.ROTATE);

    const after = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 1, 0, 0, 0],
        [0, 1, 0, 0, 0]
    ];

    expect(cmpGrids(after, stage.engine.grid)).toBeTruthy();
    expect(stage.tetris).toBeNull();
});

test('test fall', () => {
    const stage = new Stage(5, 5);
    const s = new Tetris(Shape.S, [0, 0]);
    stage.setTetris(s);

    stage.fall(Event.FALL);

    const after = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0],
        [1, 1, 0, 0, 0]
    ];

    expect(cmpGrids(after, stage.engine.grid)).toBeTruthy();
    expect(stage.tetris).toBeNull();
});

test('test settle and turnover', () => {
    const stage = new Stage(4, 4);
    const q1 = new Tetris(Shape.Q, [0, 0]);
    stage.setTetris(q1);
    stage.fall(Event.FALL);

    const q2 = new Tetris(Shape.Q, [0, 2]);
    stage.setTetris(q2);
    stage.fall(Event.FALL);

    const after = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];

    expect(cmpGrids(after, stage.engine.grid)).toBeTruthy();
    expect(stage.tetris).toBeNull();
});

test('test game over', () => {
    const stage = new Stage(5, 5);
    const s = new Tetris(Shape.S, [0, 0]);
    stage.setTetris(s);
    stage.fall(Event.FALL);

    const q = new Tetris(Shape.Q, [0, 0]);
    stage.setTetris(q);
    stage.fall(Event.FALL);

    const i = new Tetris(Shape.I, [0, 0]);
    stage.setTetris(i);
    try {
        stage.move(Event.DOWN);
    } catch(e) {
        expect(e).toBe('Game Over!')
    }

    const l = new Tetris(Shape.L, [0, 0]);
    stage.setTetris(l);
    try {
        stage.move(Event.LEFT);
    } catch(e) {
        expect(e).toBe('Game Over!')
    }
});
