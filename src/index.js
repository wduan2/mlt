import React from 'react'
import {render} from 'react-dom'
import UI from './ui/UI'

render(
    <UI width={10} height={20} initTopLeft={[0, 3]}/>,
    document.getElementById('mlt')
);
