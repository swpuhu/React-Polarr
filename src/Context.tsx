import React, {createContext, useReducer} from "react";
import {ActionType, EditStatus} from "./types/type";

export type Layer = {
    source: ImageBitmap | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
    position: {
        x1: number,
        y1: number,
        x2: number,
        y2: number
    },
}
type StateType = {
    editStatus: EditStatus;
    layers :Array<Layer>,
    width: number,
    height: number
}


const initialState: StateType = {
    editStatus: EditStatus.IDLE,
    layers: [

    ],
    width: 100,
    height: 100,
};

const reducer = (state: typeof initialState, action: {type: ActionType, payload: any}) => {
    switch (action.type) {
        case ActionType.updateEditStatus:
            return {
                ...state,
                editStatus: action.payload
            };
        case ActionType.addLayer:
            return {
                ...state,
                layers: [
                    ...state.layers,
                    action.payload
                ]
            };
        case ActionType.updateCanvasSize:
            return {
                ...state,
                width: action.payload.width,
                height: action.payload.height
            };
        default:
            return state;
    }
};

export const Context = createContext({state: initialState , dispatch: (_action: {type: ActionType, payload: any}) => {}});

export const Provider:React.FC = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <Context.Provider value={{state: state, dispatch}}>
            {props.children}
        </Context.Provider>
    )
};