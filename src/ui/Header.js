import React from 'react'
import moment from 'moment'
import bulma from 'bulma/css/bulma.css'
import {KEY_MAP} from "../core/event";

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
                    Rotate: {KEY_MAP.rotate.display}  Fall: {KEY_MAP.fall.display}  Down: {KEY_MAP.down.display}  Left: {KEY_MAP.left.display}  Right: {KEY_MAP.right.display}
                </div>
            </div>
        )
    }
}

export default Header
