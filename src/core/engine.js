export default class Engine {

    /*
     * Calculates the deepest position where the tetris can go.
     *
     *    _ ______ ur
     *   |_|_ _
     *   |_|_|_|
     *       |_|__ lr
     *  _     * <--- c with min(sr - lr)
     * |_|_   _ __ sr
     * |_|_|_|_|
     *
     * fr: the upper row of the tetris after falling
     * sr: the row of the stage surface before falling
     * lr: the lower row of the tetris before falling
     * ur: the upper row of the tetris before falling
     *
     * The fr is determined by the column which has min(sr - lr).
     *
     * So the final upper row of the tetris after falling is:
     *
     *          fr = min(sr - lr + ur - 1)
     *
     * @param t the tetris
     * @param grid
     * @return the upper row of the tetris after falling
     */
    static deepest = (t, grid) => {
        const topLeft = t.topLeft;
        const blocks = t.blocks;

        // find and record the minimum distance between the tetirs and grid surface
        let minLr = 0;
        let minSr = grid.length;

        let lr;
        let sr;
        for (let tc = 0; tc < blocks[0].length; tc++) {
            // for each column of the tetris blocks, get the lower row
            let tr = blocks.length - 1;
            while (tr >= 0 && blocks[tr][tc] !== 1) {
                tr--;
            }

            lr = tr + topLeft[0];
            sr = Engine.highestSurface(grid, lr, tc + topLeft[1]);

            if (sr - lr < minSr - minLr) {
                minSr = sr;
                minLr = lr;
            }
        }

        return minSr - minLr + topLeft[0] - 1;
    };

    /*
     * Rotates the tetris 90 degrees clockwise.
     *
     * Note: topLeft of the tetris won't be changed
     *  _ _                   _ _
     * |1|2|      _ _ _      |6|5|      _ _ _
     * |3|4| ==> |5|3|1| ==> |4|3| ==> |2|4|6|
     * |5|6|     |6|4|2|     |2|1|     |1|3|5|
     *
     * by observation:
     *      nmatrix.row = matrix.col
     *      nmatrix.col = matrix.row
     *
     *      nx = y
     *      ny = r - x - 1
     *
     * @param t
     */
    static rotate = (t) => {
        const before = t.blocks;
        const after = Array(before[0].length).fill(0);
        for (let r = 0; r < after.length; r++) {
            after[r] = Array(before.length).fill(0);
        }

        for (let x = 0; x < before.length; x++) {
            for (let y = 0; y < before[0].length; y++) {
                after[y][before.length - x - 1] = before[x][y];
            }
        }
        return after;
    };

    /*
     * Test if the tetris is blocked at a position.
     *
     * @param topLeft
     * @param blocks
     * @param m the movement that will be taken
     * @param grid
     * @return true if the tetris is blocked
     */
    static isBlocked = (topLeft, blocks, m, grid) => {
        for (let tr = 0; tr < blocks.length; tr++) {
            for (let tc = 0; tc < blocks[tr].length; tc++) {
                // skip empty tetris blocks
                if (blocks[tr][tc] === 0) continue;

                const nr = tr + topLeft[0] + m[0];
                const nc = tc + topLeft[1] + m[1];

                // out of horizontal boundary
                if (nr < 0 || nr >= grid.length) {
                    return true;
                }

                // out of vertical boundary
                if (nc < 0 || nc >= grid[0].length) {
                    return true;
                }

                // blocked by digested blocks
                if (grid[nr][nc] === 1) {
                    return true;
                }
            }
        }
        return false;
    };

    static digest = (t, fr, grid) => {
        const topLeft = t.topLeft;
        const blocks = t.blocks;

        for (let tr = 0; tr < blocks.length; tr++) {
            for (let tc = 0; tc < blocks[tr].length; tc++) {
                // ignore the 0 block of the tetris
                if (blocks[tr][tc] === 1) {
                    grid[tr + fr][tc + topLeft[1]] = blocks[tr][tc];
                }
            }
        }
    };

    static shift = (erasedRow, grid) => {
        for (let r = erasedRow - 1; r >= 0; r--) {
            grid[r + 1] = grid[r];
        }
        grid[0] = Array(grid[erasedRow].length).fill(0);
    };

    static canErase = (row, grid) => {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col] === 0) {
                // not all of the columns are filled at the row
                return false;
            }
        }
        return true;
    };

    /*
     * Gets the highest surface respect to the provided block.
     * 
     * @param grid
     * @param blockRow
     * @param blockCol
     */
    static highestSurface = (grid, blockRow, blockCol) => {
        // coordinate system:
        // 
        //      o ---> x
        //      |
        //      V y
        // 
        // edge case 1: if the last row is empty then the highest surface is the height of the grid
        // which is out of the array index
        //
        // edge case 2: if the tetris is under the highest surface, in order to calcuate the highest
        // surface respect to the tetris, the height search must be started from the 'blockRow'
        // 
        //       _ _ _ _ ______ the highest surface
        //      |_|_|_|_|
        //      |_|_ _____ the tetris
        //      |_|x|  
        //      |_|x|_ _ ___ the highest surface respect to the tetris
        //      |_|x|x|x|
        //      |_|_|_|_|

        let highest = blockRow;

        while (highest < grid.length && grid[highest][blockCol] !== 1) {
            highest++;
        }

        return highest;
    };
}
