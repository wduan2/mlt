import React from 'react'
import Stage from '../core/stage'
import Factory from '../core/tetris'
import Event from '../core/event'

class UI extends React.Component {
    constructor(props) {
        super(props);
        const { width, height, initTopLeft } = props;
        this.stage = new Stage(width, height);
        this.initTopLeft = initTopLeft;
    }

    keyHandler = (keyEvent) => {
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
        if (event) {
            this.stage.reduce(event);
        }
    };

    render() {
        return(
            <div>
                <div>container</div>
            </div>
        )
    }
}

export default UI;
