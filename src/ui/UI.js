import React from 'react'
import Stage from '../core/stage'
import Event from '../core/event'
import {Observable} from 'rxjs/Rx'

class UI extends React.Component {
    constructor(props) {
        super(props);
        const {width, height, initTopLeft} = props;
        this.stage = new Stage(width, height, initTopLeft);
    }

    componentDidMount() {

    }

    resume() {
        this.keyOb.subscribe(e => this.stage.reduce(e));
        this.gravityOb.subscribe(() => this.stage.reduce(Event.DOWN));
    }

    pause() {
        this.keyOb.unsubscribe();
        this.gravityOb.unsubscribe();
    }

    keyOb = Observable.fromEvent(document, 'keydown')
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

    gravityOb = Observable.interval(200).timeInterval();

    render() {
        return (
            <div>
                <button onClick={this.resume}>Start</button>
                <div>container</div>
            </div>
        )
    }
}

export default UI;
