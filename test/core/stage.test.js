import Event from '../../src/core/event';
import Stage from '../../src/core/stage';
import {Tetris, Shape, Factory} from '../../src/core/tetris'

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

test('test reduce', () => {
    const stage = new Stage(10, 10);
    stage.move = jest.fn();
    stage.rotate = jest.fn();
    stage.fall = jest.fn();
    stage.settle = jest.fn();

    stage.reduce(Event.DOWN);
    expect(stage.move).toHaveBeenCalledTimes(1);

    stage.reduce(Event.RIGHT);
    expect(stage.move).toHaveBeenCalledTimes(2);

    stage.reduce(Event.LEFT);
    expect(stage.move).toHaveBeenCalledTimes(3);

    stage.reduce(Event.ROTATE);
    expect(stage.rotate).toHaveBeenCalledTimes(1);

    stage.reduce(Event.FALL);
    expect(stage.fall).toHaveBeenCalledTimes(1);
});

test('test move', () => {
    const stage = new Stage(5, 5);
    stage.fall = jest.fn();
    stage.settle = jest.fn();

    const s = new Tetris(Shape.S, [0, 0]);
    stage.tetris = s;

    stage.move(Event.DOWN);
    expect(s.topLeft[0] === 1);

    stage.move(Event.LEFT);
    expect(s.topLeft[1] === 0);

    stage.move(Event.RIGHT);
    expect(s.topLeft[1] === 1);
});

test('test move integration', () => {
    Factory.nextTetris = jest.fn();

    const stage = new Stage(5, 5);

    stage.tetris = new Tetris(Shape.S, [0, 0]);
    stage.reduce(Event.DOWN);
    stage.reduce(Event.LEFT);
    stage.reduce(Event.RIGHT);
    stage.reduce(Event.DOWN);
    stage.reduce(Event.DOWN);

    const after = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 1, 1, 0],
        [0, 1, 1, 0, 0]
    ];

    expect(cmpGrids(after, stage.grid)).toBeTruthy();
    expect(Factory.nextTetris).toHaveBeenCalledTimes(2);
});

test('test rotate integration', () => {
    Factory.nextTetris = jest.fn();

    const stage = new Stage(5, 5);

    stage.tetris = new Tetris(Shape.S, [0, 0]);
    stage.reduce(Event.DOWN);
    stage.reduce(Event.DOWN);
    stage.reduce(Event.ROTATE);

    const after = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 1, 0, 0, 0],
        [0, 1, 0, 0, 0]
    ];

    expect(cmpGrids(after, stage.grid)).toBeTruthy();
    expect(Factory.nextTetris).toHaveBeenCalledTimes(2);
});

test('test fall integration', () => {
    Factory.nextTetris = jest.fn();

    const stage = new Stage(5, 5);

    stage.tetris  = new Tetris(Shape.S, [0, 0]);
    stage.reduce(Event.FALL);

    const after = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0],
        [1, 1, 0, 0, 0]
    ];

    expect(cmpGrids(after, stage.grid)).toBeTruthy();
    expect(Factory.nextTetris).toHaveBeenCalledTimes(2);
});

test('test settle', () => {
    Factory.nextTetris = jest.fn();

    const stage = new Stage(4, 4);

    stage.tetris = new Tetris(Shape.Q, [0, 0]);
    stage.reduce(Event.FALL);

    stage.tetris = new Tetris(Shape.Q, [0, 2]);
    stage.reduce(Event.FALL);

    const after = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];

    expect(cmpGrids(after, stage.grid)).toBeTruthy();
    expect(Factory.nextTetris).toHaveBeenCalledTimes(3);
});

test('test game over', () => {
    const stage = new Stage(5, 5);

    stage.tetris = new Tetris(Shape.S, [0, 0]);
    stage.reduce(Event.FALL);

    stage.tetris = new Tetris(Shape.Q, [0, 0]);
    stage.reduce(Event.FALL);

    stage.tetris = new Tetris(Shape.I, [0, 0]);
    try {
        stage.reduce(Event.DOWN);
    } catch(e) {
        expect(e).toBe('Game Over!')
    }

    // newly created tetris caused game over
    stage.tetris = new Tetris(Shape.L, [0, 0]);
    try {
        stage.reduce(Event.LEFT);
    } catch(e) {
        expect(e).toBe('Game Over!')
    }
});
