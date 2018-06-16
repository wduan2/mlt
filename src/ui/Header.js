import React from 'react'
import moment from 'moment'
import bulma from 'bulma/css/bulma.css'
import {keyMap} from "../core/event";

class Header extends React.Component {
    constructor() {
        super();
        this.timeFormat = 'H:mm:ss';
        this.state = {currentTime: moment().format(this.timeFormat)};
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        )
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({
            currentTime: moment().format(this.timeFormat)
        })
    }

    render() {
        return (
            <div className={bulma['tags']} style={{marginTop: '1%'}}>
                <div
                    className={[bulma['tag'], bulma['is-info']].join(' ')}
                    style={{display: 'block', marginLeft: 'auto', padding: '3px 5px', textAlign: 'center', width: '5%'}}>
                    {this.state.currentTime}
                </div>

                <div
                    className={[bulma['tag'], bulma['is-info']].join(' ')}
                    style={{display: 'block', marginRight: 'auto', padding: '3px 5px', textAlign: 'center'}}>
                    Rotate: {keyMap.rotate.display} Fall: {keyMap.fall.display} Down: {keyMap.down.display} Left: {keyMap.left.display} Right: {keyMap.right.display}
                </div>
            </div>
        )
    }
}

export default Header
