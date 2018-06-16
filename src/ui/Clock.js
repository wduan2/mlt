import React from 'react'
import moment from 'moment'
import bulma from 'bulma/css/bulma.css'

class Clock extends React.Component {
    constructor() {
        super();
        this.timeFormat = 'h:mm:ss a, dddd, MM/DD/YYYY';
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
            <div className={[bulma['tag'], bulma['is-primary']].join(' ')} style={{margin: '1%'}}>{this.state.currentTime}</div>
        )
    }
}

export default Clock
