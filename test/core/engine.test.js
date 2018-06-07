import Engine from '../../src/core/Engine'
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

test('test deepest', () => {
    const before = [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
    ];

    const after = [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
    ];

    const q = new Tetris(Shape.Q, [0, 0]);
    const s = new Tetris(Shape.S, [0, 0]);
    const z = new Tetris(Shape.Z, [0, 1]);
    const l = new Tetris(Shape.L, [0, 1]);

    Engine.digest(q, Engine.deepest(q, before), before);
    after[7][0] = 1;
    after[7][1] = 1;
    after[8][0] = 1;
    after[8][1] = 1;
    expect(cmpGrids(before, after)).toBeTruthy();

    Engine.digest(s, Engine.deepest(s, before), before);
    after[5][1] = 1;
    after[5][2] = 1;
    after[6][0] = 1;
    after[6][1] = 1;
    expect(cmpGrids(before, after)).toBeTruthy();

    Engine.digest(z, Engine.deepest(z, before), before);
    after[3][1] = 1;
    after[3][2] = 1;
    after[4][2] = 1;
    after[4][3] = 1;
    expect(cmpGrids(before, after)).toBeTruthy();

    Engine.digest(l, Engine.deepest(l, before), before);
    after[0][1] = 1;
    after[1][1] = 1;
    after[2][1] = 1;
    after[2][2] = 1;
    expect(cmpGrids(before, after)).toBeTruthy();
});

test('test deepest overflow', () => {
    const grid = [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
    ];

    const q = new Tetris(Shape.Q, [0, 0]);
    const s = new Tetris(Shape.S, [0, 0]);
    const z = new Tetris(Shape.Z, [0, 1]);
    const l = new Tetris(Shape.L, [0, 1]);
    const j = new Tetris(Shape.J, [0, 1]);

    Engine.digest(q, Engine.deepest(q, grid), grid);
    Engine.digest(s, Engine.deepest(s, grid), grid);
    Engine.digest(z, Engine.deepest(z, grid), grid);
    Engine.digest(l, Engine.deepest(l, grid), grid);
    expect(Engine.deepest(j, grid)).toBeLessThan(0);
})

test('test highestSurface', () => {
    const grid = [
        [0, 0, 0, 1],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [1, 1, 0, 1]
    ];

    expect(Engine.highestSurface(0, grid)).toBe(3);
    expect(Engine.highestSurface(1, grid)).toBe(1);
    expect(Engine.highestSurface(2, grid)).toBe(4);
    expect(Engine.highestSurface(3, grid)).toBe(0);
})

test('test canErase', () => {
    const grid = [
        [0, 0, 0, 0],
        [0, 1, 0, 0],
        [1, 1, 1, 1],
        [0, 1, 0, 1]
    ];

    expect(Engine.canErase(2, grid)).toBeTruthy();
    expect(Engine.canErase(0, grid)).toBeFalsy();
    expect(Engine.canErase(1, grid)).toBeFalsy();
    expect(Engine.canErase(3, grid)).toBeFalsy();
})

test('test shift', () => {
    const before = [
        [0, 0, 0, 0],
        [0, 1, 0, 0],
        [1, 1, 1, 1],
        [0, 1, 0, 1]
    ];

    const after = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 1]
    ];

    Engine.shift(2, before);
    expect(cmpGrids(before, after)).toBeTruthy();
})

test('test isBlocked', () => {
    const grid = [
        [0, 0, 0, 0],
        [0, 1, 0, 0],
        [1, 1, 0, 0],
        [0, 1, 0, 0]
    ];

    // blocked by blocks
    const q1 = new Tetris(Shape.Q, [0, 0]);
    const q2 = new Tetris(Shape.Q, [0, 2]);
    expect(Engine.isBlocked(q1.topLeft, q1.blocks, [0, 0], grid)).toBeTruthy();
    expect(Engine.isBlocked(q2.topLeft, q1.blocks, [0, 0], grid)).toBeFalsy();

    // out of boundary
    expect(Engine.isBlocked(q2.topLeft, q2.blocks, [0, 1], grid)).toBeTruthy();
    expect(Engine.isBlocked(q2.topLeft, q2.blocks, [2, 0], grid)).toBeFalsy();
    expect(Engine.isBlocked(q2.topLeft, q2.blocks, [3, 0], grid)).toBeTruthy();
})

test('test rotate', () => {
    const q = new Tetris(Shape.Q, [0, 0]);
    const i = new Tetris(Shape.I, [0, 0]);
    const s = new Tetris(Shape.S, [0, 0]);
    const t = new Tetris(Shape.T, [0, 0]);

    q.blocks = Engine.rotate(q);
    expect(cmpGrids(q.blocks,
        [
            [1, 1],
            [1, 1]
        ])).toBeTruthy();

    q.blocks = Engine.rotate(q);
    expect(cmpGrids(q.blocks,
        [
            [1, 1],
            [1, 1]
        ])).toBeTruthy();

    i.blocks = Engine.rotate(i);
    expect(cmpGrids(i.blocks,
        [
            [1],
            [1],
            [1],
            [1]
        ])).toBeTruthy();

    i.blocks = Engine.rotate(i);
    expect(cmpGrids(i.blocks,
        [
            [1, 1, 1, 1]
        ])).toBeTruthy();

    s.blocks = Engine.rotate(s);
    expect(cmpGrids(s.blocks,
        [
            [1, 0],
            [1, 1],
            [0, 1]
        ])).toBeTruthy();

    s.blocks = Engine.rotate(s);
    expect(cmpGrids(s.blocks,
        [
            [0, 1, 1],
            [1, 1, 0]
        ])).toBeTruthy();

    t.blocks = Engine.rotate(t);
    expect(cmpGrids(t.blocks,
        [
            [1, 0],
            [1, 1],
            [1, 0]
        ])).toBeTruthy();

    t.blocks = Engine.rotate(t);
    expect(cmpGrids(t.blocks,
        [
            [1, 1, 1],
            [0, 1, 0]
        ])).toBeTruthy();

    t.blocks = Engine.rotate(t);
    expect(cmpGrids(t.blocks,
        [
            [0, 1],
            [1, 1],
            [0, 1]
        ])).toBeTruthy();

    t.blocks = Engine.rotate(t);
    expect(cmpGrids(t.blocks,
        [
            [0, 1, 0],
            [1, 1, 1]
        ])).toBeTruthy();
});
