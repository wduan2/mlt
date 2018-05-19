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

});

test('test fall', () => {

});

test('test fall game over', () => {

});
