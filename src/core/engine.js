export default class Engine {
    /*
     * Represents the grids by a 2D array, the first index as the column
     * and the second index as the row
     *
     * the origin (0, 0) is the top-left corner of the grid
     *
     * if a cell of the grid is filled by a block then set it to 1 otherwise it remains 0
     */
    constructor(grid) {
        this.grid = grid;
    }

    /*
     * Calculates the deepest position where the tetris can go.
     *
     *    _ ______ ur
     *   |_|_
     *   |_|_|_
     *     |_|_|__ lr
     *  _
     * |_|    * <--- c with min(sr - lr)
     * |_|_   _
     * |_|_|_|_|__ sr
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
     * @return the upper row of the tetris after falling
     */
    fall(t) {
        const topLeft = t.topLeft;
        const blocks = t.blocks;

        // find and record the minimum distance between the tetirs and grid surface
        let minLr = 0;
        let minSr = this.grid.length;

        let lr;
        let sr;
        for (let tc = 0; tc < blocks[0].length; tc++) {
            // for each column of the tetris blocks, get the lower row
            let tr = blocks.length - 1;
            while (tr >= 0 && blocks[tr][tc] !== 1) {
                tr--;
            }

            lr = tr + topLeft[0];
            sr = this.highestSurface(tc + topLeft[1]);

            if (sr - lr < minSr - minLr) {
                minSr = sr;
                minLr = lr;
            }
        }

        return minSr - minLr + topLeft[0] - 1;
    }

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
    rotate(t) {
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
    }

    /*
     * Test if the tetris is blocked at a position.
     *
     * @param topLeft
     * @blocks blocks
     * @param m the movement
     * @return true if the tetris is blocked
     */
    isBlocked(topLeft, blocks, m) {
        for (let tr = 0; tr < blocks.length; tr++) {
            for (let tc = 0; tc < blocks[tr].length; tc++) {
                const nr = tr + topLeft[0] + m[0];
                const nc = tc + topLeft[1] + m[1];

                // out of horizontal boundary
                if (nr < 0 || nr >= this.grid.length) {
                    return true;
                }

                // out of vertical boundary
                if (nc < 0 || nc >= this.grid[0].length) {
                    return true;
                }

                // blocked by digested blocks
                if (this.grid[nr][nc] === 1) {
                    return true;
                }
            }
        }
        return false;
    }

    /*
     * Digests the tetris.
     *
     * @param t
     * @param fr the final row of the top left block
     */
    digest(t, fr) {
        const topLeft = t.topLeft;
        const blocks = t.blocks;

        for (let tr = 0; tr < blocks.length; tr++) {
            for (let tc = 0; tc < blocks[tr].length; tc++) {
                // ignore the 0 block of the tetris
                if (blocks[tr][tc] === 1) {
                    this.grid[tr + fr][tc + topLeft[1]] = blocks[tr][tc];
                }
            }
        }
    }

    shift(erasedRow) {
        for (let r = erasedRow - 1; r >= 0; r--) {
            this.grid[r + 1] = this.grid[r];
        }
        this.grid[0] = Array(this.grid[erasedRow].length).fill(0);
    }

    canErase(row) {
        for (let col = 0; col < this.grid[row].length; col++) {
            if (this.grid[row][col] === 0) {
                // not all of the columns are filled at the row
                return false;
            }
        }
        return true;
    }

    /*
     * Gets the highest surface of one column by finding the filled row with the smallest index
     * since the origin of the coordinate system is at the top-left corner of the grid.
     *
     * @param col the column
     * @return the height
     */
    highestSurface(col) {
        let highest = 0;
        while (highest < this.grid.length && this.grid[highest][col] !== 1) {
            highest++;
        }
        // if the last row is empty then the highest surface is the height of the grid
        // which is out of the array index
        return highest;
    }
}
