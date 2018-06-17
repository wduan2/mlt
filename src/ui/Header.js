import React from 'react'
import bulma from 'bulma/css/bulma.css'
import {KEY_MAP} from "../core/event";

class Header extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className={bulma['tags']} style={{marginTop: '1%'}}>
                <div
                    className={[bulma['tag'], bulma['is-info']].join(' ')}
                    style={{display: 'block', margin: '1% auto', padding: '3px 1%', fontSize: '100%', textAlign: 'center'}}>
                    Rotate: {KEY_MAP.rotate.display}  Fall: {KEY_MAP.fall.display}  Down: {KEY_MAP.down.display}  Left: {KEY_MAP.left.display}  Right: {KEY_MAP.right.display}
                </div>
            </div>
        )
    }
}

export default Header
