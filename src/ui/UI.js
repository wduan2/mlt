import React from 'react'
import Stage from '../core/stage'
import Event from '../core/event'
import {Observable} from 'rxjs/Rx'

class UI extends React.Component {
    state = {
        nextStatus: 'Start',
        paused: true
    };

    constructor(props) {
        super(props);
        const {width, height, initTopLeft} = props;
        this.stage = new Stage(width, height, initTopLeft);
    }

    componentDidMount() {

    }

    resume() {
        this.activeKeyOb = keyOb.subscribe(e => this.stage.reduce(e));
        this.activeGravityOb = gravityOb.subscribe(() => this.stage.reduce(Event.DOWN));
        this.setState({paused: false, nextStatus: 'Pause'});

        // TODO: handle game over!
    }

    pause() {
        // for RxJs 5
        this.activeKeyOb.unsubscribe();
        this.activeGravityOb.unsubscribe();
        this.setState({paused: true, nextStatus: 'Resume'});
    }

    render() {
        return (
            <div>
                <button onClick={() => {
                    if (this.state.paused) {
                        this.resume();
                    } else {
                        this.pause();
                    }
                }}>{this.state.nextStatus}</button>
                <div>container</div>
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
