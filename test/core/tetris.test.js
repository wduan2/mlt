import {Factory} from '../../src/core/tetris'

test('test nextShapeName', () => {
    const count = {};
    let sn;
    for (let i = 0; i < 10000; i++) {
        sn = Factory.nextShapeName();
        count[sn] = count[sn] ? count[sn] + 1 : 1;
    }
    console.log(count);
});
