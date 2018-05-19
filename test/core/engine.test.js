import Engine from '../../src/core/engine'
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

test('test fall', () => {
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

    const engine = new Engine(before);

    const q = new Tetris(Shape.Q, [0, 0]);
    const s = new Tetris(Shape.S, [0, 0]);
    const z = new Tetris(Shape.Z, [0, 1]);
    const l = new Tetris(Shape.L, [0, 1]);

    engine.digest(q, engine.fall(q));
    after[7][0] = 1;
    after[7][1] = 1;
    after[8][0] = 1;
    after[8][1] = 1;
    expect(cmpGrids(before, after)).toBeTruthy();

    engine.digest(s, engine.fall(s));
    after[5][1] = 1;
    after[5][2] = 1;
    after[6][0] = 1;
    after[6][1] = 1;
    expect(cmpGrids(before, after)).toBeTruthy();

    engine.digest(z, engine.fall(z));
    after[3][1] = 1;
    after[3][2] = 1;
    after[4][2] = 1;
    after[4][3] = 1;
    expect(cmpGrids(before, after)).toBeTruthy();

    engine.digest(l, engine.fall(l));
    after[0][1] = 1;
    after[1][1] = 1;
    after[2][1] = 1;
    after[2][2] = 1;
    expect(cmpGrids(before, after)).toBeTruthy();
});

test('test fall and game over', () => {
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
    ]

    const engine = new Engine(grid);

    const q = new Tetris(Shape.Q, [0, 0]);
    const s = new Tetris(Shape.S, [0, 0]);
    const z = new Tetris(Shape.Z, [0, 1]);
    const l = new Tetris(Shape.L, [0, 1]);
    const j = new Tetris(Shape.J, [0, 1]);

    engine.digest(q, engine.fall(q));
    engine.digest(s, engine.fall(s));
    engine.digest(z, engine.fall(z));
    engine.digest(l, engine.fall(l));
    expect(engine.fall(j)).toBeLessThan(0);
})

test('test highestSurface', () => {
    const grid = [
        [0, 0, 0, 1],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [1, 1, 0, 1]
    ];

    const engine = new Engine(grid);
    expect(engine.highestSurface(0)).toBe(3);
    expect(engine.highestSurface(1)).toBe(1);
    expect(engine.highestSurface(2)).toBe(4);
    expect(engine.highestSurface(3)).toBe(0);
})

test('test canErase', () => {
    const grid = [
        [0, 0, 0, 0],
        [0, 1, 0, 0],
        [1, 1, 1, 1],
        [0, 1, 0, 1]
    ];

    const engine = new Engine(grid);
    expect(engine.canErase(2)).toBeTruthy();
    expect(engine.canErase(0)).toBeFalsy();
    expect(engine.canErase(1)).toBeFalsy();
    expect(engine.canErase(3)).toBeFalsy();
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

    const engine = new Engine(before);
    engine.shift(2);
    expect(cmpGrids(before, after)).toBeTruthy();
})

test('test isBlocked', () => {
    const grid = [
        [0, 0, 0, 0],
        [0, 1, 0, 0],
        [1, 1, 0, 0],
        [0, 1, 0, 0]
    ];

    const engine = new Engine(grid);

    // blocked by blocks
    const q1 = new Tetris(Shape.Q, [0, 0]);
    const q2 = new Tetris(Shape.Q, [0, 2]);
    expect(engine.isBlocked(q1.topLeft, q1.blocks, [0, 0])).toBeTruthy();
    expect(engine.isBlocked(q2.topLeft, q1.blocks, [0, 0])).toBeFalsy();

    // out of boundary
    expect(engine.isBlocked(q2.topLeft, q2.blocks, [0, 1])).toBeTruthy();
    expect(engine.isBlocked(q2.topLeft, q2.blocks, [2, 0])).toBeFalsy();
    expect(engine.isBlocked(q2.topLeft, q2.blocks, [3, 0])).toBeTruthy();
})

test('test rotate', () => {
    const engine = new Engine([[]]);

    const q = new Tetris(Shape.Q, [0, 0]);
    const i = new Tetris(Shape.I, [0, 0]);
    const s = new Tetris(Shape.S, [0, 0]);
    const t = new Tetris(Shape.T, [0, 0]);

    q.blocks = engine.rotate(q);
    expect(cmpGrids(q.blocks,
        [
            [1, 1],
            [1, 1]
        ])).toBeTruthy();

    q.blocks = engine.rotate(q);
    expect(cmpGrids(q.blocks,
        [
            [1, 1],
            [1, 1]
        ])).toBeTruthy();

    i.blocks = engine.rotate(i);
    expect(cmpGrids(i.blocks,
        [
            [1],
            [1],
            [1],
            [1]
        ])).toBeTruthy();

    i.blocks = engine.rotate(i);
    expect(cmpGrids(i.blocks,
        [
            [1, 1, 1, 1]
        ])).toBeTruthy();

    s.blocks = engine.rotate(s);
    expect(cmpGrids(s.blocks,
        [
            [1, 0],
            [1, 1],
            [0, 1]
        ])).toBeTruthy();

    s.blocks = engine.rotate(s);
    expect(cmpGrids(s.blocks,
        [
            [0, 1, 1],
            [1, 1, 0]
        ])).toBeTruthy();

    t.blocks = engine.rotate(t);
    expect(cmpGrids(t.blocks,
        [
            [1, 0],
            [1, 1],
            [1, 0]
        ])).toBeTruthy();

    t.blocks = engine.rotate(t);
    expect(cmpGrids(t.blocks,
        [
            [1, 1, 1],
            [0, 1, 0]
        ])).toBeTruthy();

    t.blocks = engine.rotate(t);
    expect(cmpGrids(t.blocks,
        [
            [0, 1],
            [1, 1],
            [0, 1]
        ])).toBeTruthy();

    t.blocks = engine.rotate(t);
    expect(cmpGrids(t.blocks,
        [
            [0, 1, 0],
            [1, 1, 1]
        ])).toBeTruthy();
})
