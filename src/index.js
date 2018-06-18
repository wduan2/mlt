import React from 'react'
import Modal from 'react-modal'
import {render} from 'react-dom'
import UI from './ui/UI'
import Header from './ui/Header'

Modal.setAppElement('#mlt');

render(
    <div>
        <Header/>
        <UI width={12} height={24} initTopLeft={[0, 4]} duration={60}/>
    </div>,
    document.getElementById('mlt')
);
