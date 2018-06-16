import React from 'react'
import Stage from '../core/stage'
import Event from '../core/event'
import {Observable} from 'rxjs/Rx'
import {mapTo} from 'rxjs/operators'
import bulma from 'bulma/css/bulma.css'

class UI extends React.Component {
    state = {
        nextStatus: START,
        paused: true,
        grid: [] // init grid
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
                        style={{margin: '3%', width: '50%', display: 'block', textAlign: 'center'}}
                        ref={buttonRef => this.buttonRef = buttonRef}
                        onClick={() => {
                            if (this.state.paused) {
                                if (this.state.nextStatus === RESTART) {
                                    this.newStage();
                                    this.newGrid();
                                    this.fillGrid();
                                    this.displayGrid();
                                }
                                this.resume();
                            } else {
                                this.pause();
                            }
                            // remove focus after click
                            this.buttonRef.blur();
                        }}>{this.state.nextStatus}
                    </button>

                    <button
                        className={[bulma['button'], bulma['is-primary'], bulma['is-medium'], bulma['is-rounded']].join(' ')}
                        style={{margin: '3%', width: '50%', display: 'block', textAlign: 'center'}}
                        ref={buttonRef => this.buttonRef = buttonRef}
                        disabled={!this.state.paused || this.state.nextStatus === RESTART}
                        onClick={() => {
                            if (this.state.paused) {
                                this.newStage();
                                this.newGrid();
                                this.fillGrid();
                                this.displayGrid();
                                this.setState({nextStatus: START})
                            }
                        }}>Reset
                    </button>
                </div>
            </div>
        )
    }
}

const keyOb = Observable.fromEvent(window, 'keydown')
    .debounceTime(100)
    .map(keyEvent => {
        let event = null;
        if (keyEvent.key === 'ArrowDown') {
            event = Event.DOWN
        } else if (keyEvent.key === 'ArrowLeft') {
            event = Event.LEFT
        } else if (keyEvent.key === 'ArrowRight') {
            event = Event.RIGHT
        } else if (keyEvent.key === 'ArrowUp') {
            event = Event.FALL
        } else if (keyEvent.keyCode === 32) {
            // space key event doesn't have key value
            event = Event.ROTATE
        }
        return event;
    })
    .filter(event => !!event);

const gravityOb = Observable.interval(800)
    .timeInterval()
    .pipe(mapTo(Event.DOWN));

const START = Object.freeze('Start');
const RESTART = Object.freeze('Restart');
const RESUME = Object.freeze('Resume');
const PAUSE = Object.freeze('Pause');

export default UI;
