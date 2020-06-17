import React, {useEffect} from 'react';
import {Home} from './view/Home';
import {Provider} from "./Context";
import {globalEvents} from "./lib/globalEvents";
import styled from "styled-components";


function App() {
    let welcome = document.getElementById('welcome');
    let lastAnimation = document.getElementById('last');
    let animationEnd = false;
    let manifestLoaded = false;
    lastAnimation && lastAnimation.addEventListener('endEvent', () => {
        animationEnd = true;
        if (animationEnd && manifestLoaded) {
            welcome && welcome.classList.add('hide');
            setTimeout(() => {
                welcome && welcome.remove();
            }, 1000);
        }
    });
    globalEvents.on('manifestLoaded', () => {
        manifestLoaded = true;
        if (animationEnd && manifestLoaded) {
            welcome && welcome.classList.add('hide');
            setTimeout(() => {
                welcome && welcome.remove();
            }, 1000);
        }
    });
    return (
        <div className="App">
            <Provider>
                <Home/>
            </Provider>
        </div>

    );
}

export default App;
