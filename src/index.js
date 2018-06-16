import React from 'react'
import {render} from 'react-dom'
import UI from './ui/UI'
import Clock from './ui/Clock'

render(
    <div>
        <Clock/>
        <UI width={10} height={20} initTopLeft={[0, 3]}/>
    </div>,
    document.getElementById('mlt')
);
