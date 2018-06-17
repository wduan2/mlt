import React from 'react'
import Stage from '../core/stage'
import {gameOb, countDownOb, PAUSE, RESTART, RESUME, START} from '../core/event'
import bulma from 'bulma/css/bulma.css'
import moment from 'moment';

class UI extends React.Component {
    state = {
        nextStatus: START,
        paused: true,
        grid: [], // init grid
        score: 0,
        remaining: 0
    };

    constructor(props) {
        super(props);
    }

    // componentWillMount (deprecated) --> render --> componentDidMount
    componentDidMount() {
        this.reset();
        this.resetRemaining();
    }

    reset = () => {
        this.newStage();
        this.newGrid();
        this.fillGrid();
        this.displayGrid();
        this.displayScore();
    };

    resetRemaining = () => {
        this.newRemaining();
        this.displayRemaining();
    };

    newRemaining = () => {
        const {duration} = this.props;
        this.remaining = duration;
    };

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

    displayRemaining = () => {
        const m = moment.duration(this.remaining, 'seconds');
        const dm = m.minutes() < 10 ? `0${m.minutes()}` : m.minutes();
        const ds = m.seconds() < 10 ? `0${m.seconds()}` : m.seconds();

        this.setState({remaining: `${dm}:${ds}`})
    };

    resume = () => {
        this.setState({paused: false, nextStatus: PAUSE});

        this.activeCountDownOb = countDownOb(this.remaining).subscribe(remaining => {
            this.remaining = remaining;
            this.displayRemaining()
        });

        this.activeGameOb = gameOb(this.remaining).subscribe(event => {
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
        }, err => {
            console.err(err);
            this.pause();
            this.setState({paused: true, nextStatus: RESTART});
        }, () => {
            // times up
            this.pause();
            this.setState({paused: true, nextStatus: RESTART});
        })
    };

    pause = () => {
        // for RxJs 5
        this.activeGameOb.unsubscribe();
        this.activeCountDownOb.unsubscribe();
        this.setState({paused: true, nextStatus: RESUME});
    };

    render() {
        return (
            <div className={bulma['columns']} style={{marginLeft: '20%'}}>
                <div className={[bulma['column'], bulma['is-two-fifths']].join(' ')}>
                    <table style={{border: '2px solid', borderColor: '#1C2833', marginLeft: 'auto', marginRight: 'auto'}}>
                        <tbody>{this.state.grid.map((row, ri) => {
                            return (
                                <tr key={ri}>{row.map((col, ci) => {
                                    return (<td
                                        key={ci}
                                        style={{width: '26px', height: '26px', border: '1px solid', backgroundColor: col}}>
                                        &nbsp;</td>);
                                })}</tr>
                            );
                        })}</tbody>
                    </table>
                </div>

                <div className={[bulma['column'], bulma['is-one-fifth']].join(' ')}>
                    <div
                        className={[bulma['tag'], bulma['is-info'], bulma['is-large']].join(' ')}
                        style={{margin: '3% auto 1% auto', padding: '2%', width: '70%', display: 'block', textAlign: 'center'}}>
                        {this.state.remaining}
                    </div>

                    <div
                        className={[bulma['tag'], bulma['is-info'], bulma['is-large']].join(' ')}
                        style={{margin: '3% auto 10% auto', padding: '2%', width: '70%', display: 'block', textAlign: 'center'}}>
                        Score: {this.state.score}
                    </div>

                    <button
                        className={[bulma['button'], bulma['is-primary'], bulma['is-medium'], bulma['is-rounded']].join(' ')}
                        style={{margin: '3% auto', padding: '1%', width: '50%', display: 'block', textAlign: 'center'}}
                        onClick={() => {
                            if (this.state.paused) {
                                // restart after game over
                                if (this.state.nextStatus === RESTART) {
                                    this.reset();
                                    this.resetRemaining();
                                }
                                this.resume();
                            } else {
                                this.pause();
                            }
                        }}>{this.state.nextStatus}
                    </button>

                    <button
                        className={[bulma['button'], bulma['is-primary'], bulma['is-medium'], bulma['is-rounded']].join(' ')}
                        style={{margin: '3% auto', padding: '1%', width: '50%', display: 'block', textAlign: 'center'}}
                        disabled={!this.state.paused || this.state.nextStatus === RESTART}
                        onClick={() => {
                            if (this.state.paused) {
                                this.reset();
                                this.resetRemaining();
                                this.setState({nextStatus: START})
                            }
                        }}>Reset
                    </button>
                </div>
            </div>
        )
    }
}

export default UI;
