import React from 'react'
import {render} from 'react-dom'
import UI from './ui/UI'

render(
    <UI width={10} height={100} initTopLeft={[0, 4]}/>,
    document.getElementById('mlt')
);
