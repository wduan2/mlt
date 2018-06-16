import React from 'react'
import Stage from '../core/stage'
import {gravityOb, keyOb, PAUSE, RESTART, RESUME, START} from '../core/event'
import bulma from 'bulma/css/bulma.css'

class UI extends React.Component {
    state = {
        nextStatus: START,
        paused: true,
        grid: [], // init grid
        score: 0
    };

    constructor(props) {
        super(props);
    }

    // componentWillMount (deprecated) --> render --> componentDidMount
    componentDidMount() {
        this.newStage();
        this.newGrid();
        this.fillGrid();
        this.displayGrid();
    }

    newStage = () => {
        const {width, height, initTopLeft} = this.props;
        this.stage = new Stage(width, height, initTopLeft);
    };

    newGrid = () => {
        const {width, height} = this.props;

        this.grid = Array(height).fill('#D0D3D4');
        for (let r = 0; r < height; r++) {
            this.grid[r] = Array(width).fill('#D0D3D4');
        }
    };

    fillGrid = () => {
        const sblocks = this.stage.grid;
        for (let r = 0; r < sblocks.length; r++) {
            for (let c = 0; c < sblocks[0].length; c++) {
                if (sblocks[r][c] !== 0) {
                    this.grid[r][c] = '#00d1b2';
                } else {
                    // remove the trail of tetris
                    this.grid[r][c] = '#D0D3D4';
                }
            }
        }

        const tblocks = this.stage.tetris.blocks;
        const topLeft = this.stage.tetris.topLeft;
        for (let r = 0; r < tblocks.length; r++) {
            for (let c = 0; c < tblocks[0].length; c++) {
                if (tblocks[r][c] === 1) {
                    this.grid[r + topLeft[0]][c + topLeft[1]] = this.stage.tetris.color;
                }
            }
        }
    };

    displayScore = () => {
        this.setState({score: this.stage.score})
    };

    displayGrid = () => {
        this.setState({grid: this.grid});
    };

    resume = () => {
        this.setState({paused: false, nextStatus: PAUSE});

        [this.activeGravityOb, this.activeKeyOb] = [gravityOb, keyOb].map(ob => {
            return ob.subscribe(event => {
                try {
                    this.stage.reduce(event);
                    this.fillGrid();
                    this.displayGrid();
                    this.displayScore();
                } catch (e) {
                    // game over
                    this.pause();
                    this.setState({paused: true, nextStatus: RESTART});
                }
            })
        });
    };

    pause = () => {
        // for RxJs 5
        this.activeGravityOb.unsubscribe();
        this.activeKeyOb.unsubscribe();

        this.setState({paused: true, nextStatus: RESUME});
    };

    render() {
        return (
            <div className={bulma['columns']} style={{marginLeft: '10%'}}>
                <div className={[bulma['column'], bulma['is-two-fifths']].join(' ')}>
                    <table style={{border: '2px solid', borderColor: '#1C2833'}}>
                        <tbody>{this.state.grid.map((row, ri) => {
                            return (
                                <tr key={ri}>{row.map((col, ci) => {
                                    return (
                                        <td key={ci} style={{
                                            width: '35px',
                                            height: '35px',
                                            border: '1px solid',
                                            backgroundColor: col
                                        }}>&nbsp;</td>
                                    );
                                })}</tr>
                            );
                        })}</tbody>
                    </table>
                </div>

                <div className={[bulma['column'], bulma['is-one-fifth']].join(' ')}>
                    <button
                        className={[bulma['button'], bulma['is-primary'], bulma['is-medium'], bulma['is-rounded']].join(' ')}
                        style={{margin: '3% auto', width: '50%', display: 'block', textAlign: 'center'}}
                        onClick={() => {
                            if (this.state.paused) {
                                if (this.state.nextStatus === RESTART) {
                                    this.newStage();
                                    this.newGrid();
                                    this.fillGrid();
                                    this.displayGrid();
                                    this.displayScore();
                                }
                                this.resume();
                            } else {
                                this.pause();
                            }
                        }}>{this.state.nextStatus}
                    </button>

                    <button
                        className={[bulma['button'], bulma['is-primary'], bulma['is-medium'], bulma['is-rounded']].join(' ')}
                        style={{margin: '3% auto', width: '50%', display: 'block', textAlign: 'center'}}
                        disabled={!this.state.paused || this.state.nextStatus === RESTART}
                        onClick={() => {
                            if (this.state.paused) {
                                this.newStage();
                                this.newGrid();
                                this.fillGrid();
                                this.displayGrid();
                                this.displayScore();
                                this.setState({nextStatus: START})
                            }
                        }}>Reset
                    </button>

                    <div
                        className={[bulma['tag'], bulma['is-info'], bulma['is-large']].join(' ')}
                        style={{
                            margin: '20% auto',
                            padding: '2%',
                            width: '70%',
                            display: 'block',
                            textAlign: 'center'
                        }}>
                        Score: {this.state.score}
                    </div>
                </div>
            </div>
        )
    }
}

export default UI;
