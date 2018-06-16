import React from 'react'
import {render} from 'react-dom'
import UI from './ui/UI'
import Header from './ui/Header'

render(
    <div>
        <Header/>
        <UI width={10} height={20} initTopLeft={[0, 3]}/>
    </div>,
    document.getElementById('mlt')
);
