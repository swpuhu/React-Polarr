import React, {createContext, useContext, useState} from 'react';
import {ActionType, ColorContext} from "../lib/Color";

const CountContext = createContext(0);
const Count:React.FC = () => {
    const [count, setCount] = useState(0);
    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => {setCount(count + 1)}}>Click Me</button>
            <CountContext.Provider value={count}>

            </CountContext.Provider>
        </div>
    )
};

const ShowArea = () => {
    const {state, dispatch} = useContext(ColorContext);
    console.log(state.color);
    return (
        <div style={{color: state.color}}>字体颜色blue</div>
    )
};

const Buttons = () => {
    const {state, dispatch} = useContext(ColorContext);
    return (
        <div>
            <button onClick={() => {
                dispatch({type: ActionType.UPDATE_COLOR, payload: 'red'})
            }}>红色</button>
            <button onClick={() => dispatch({type: ActionType.UPDATE_COLOR, payload: 'yellow'})}>黄色</button>
        </div>
    )
};

export {Count, ShowArea, Buttons}