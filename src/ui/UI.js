import React from 'react'
import Stage from '../core/stage'
import Event from '../core/event'
import {Observable} from 'rxjs/Rx'

class UI extends React.Component {
    state = {
        nextStatus: 'Start',
        paused: true,
        grid: [[]] // init grid
    };

    constructor(props) {
        super(props);
    }

    // componentWillMount (deprecated) --> render --> componentDidMount
    componentDidMount() {
        this.reset();
    }

    reset = () => {
        const {width, height, initTopLeft} = this.props;

        this.stage = new Stage(width, height, initTopLeft);
        this.grid = Array(height).fill('#D0D3D4');
        for (let r = 0; r < height; r++) {
            this.grid[r] = Array(width).fill('#D0D3D4');
        }

        this.setState({grid: this.grid});
    };

    resume = () => {
        this.activeKeyOb = keyOb.subscribe(e => {
            this.stage.reduce(e);
            this.refreshGrid();
        });

        this.activeGravityOb = gravityOb.subscribe(() => {
            this.stage.reduce(Event.DOWN);
            this.refreshGrid();
        });

        this.setState({paused: false, nextStatus: 'Pause'});

        // TODO: handle game over!
    };

    refreshGrid = () => {
        const sblocks = this.stage.grid;
        for (let r = 0; r < sblocks.length; r++) {
            for (let c = 0; c < sblocks[0].length; c++) {
                if (sblocks[r][c] !== 0) {
                    this.grid[r][c] = '#515A5A';
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

        this.setState({grid: this.grid});
    };

    pause = () => {
        // for RxJs 5
        this.activeKeyOb.unsubscribe();
        this.activeGravityOb.unsubscribe();
        this.setState({paused: true, nextStatus: 'Resume'});
    };

    render() {
        return (
            <div>
                <button ref={buttonRef => this.buttonRef = buttonRef} onClick={() => {
                    if (this.state.paused) {
                        this.resume();
                    } else {
                        this.pause();
                    }
                    // remove focus after click
                    this.buttonRef.blur();
                }}>{this.state.nextStatus}</button>
                <table style={{
                    border: 'solid',
                    borderColor: '#1C2833',
                    borderWidth: '3px'
                }}>
                    <tbody>{this.state.grid.map((row, ri) => {
                        return (
                            <tr key={ri}>{row.map((col, ci) => {
                                return (
                                    <td key={ci} style={{
                                        width: '20px',
                                        height: '20px',
                                        borderWidth: '0.5px',
                                        backgroundColor: col
                                    }}>&nbsp;</td>
                                );
                            })}</tr>
                        );
                    })}</tbody>
                </table>
            </div>
        )
    }
}

const keyOb = Observable.fromEvent(document, 'keydown')
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
            event = Event.ROTATE
        } else if (keyEvent.keyCode === 32) {
            // space key event doesn't have key value
            event = Event.FALL
        }
        return event;
    })
    .filter(event => !!event);

const gravityOb = Observable.interval(800).timeInterval();

export default UI;
