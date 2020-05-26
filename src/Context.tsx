import React, {createContext, useReducer} from "react";
import {ActionType, EditStatus, Layer, StateType} from "./types/type";


const initialState: StateType = {
    editStatus: EditStatus.IDLE,
    layers: [

    ],
    width: window.innerWidth,
    height: window.innerHeight - 92,
};

const reducer = (state: typeof initialState, action: {type: ActionType, payload: any}) => {
    switch (action.type) {
        case ActionType.updateEditStatus:
            return {
                ...state,
                editStatus: action.payload
            };
        case ActionType.addLayer:
            const layer: Layer = action.payload;
            if (layer.source.width / layer.source.height > state.width / state.height) {
                // 宽适配
                let height = state.width / (layer.source.width / layer.source.height);
                layer.position.x1 = -1;
                layer.position.x2 = 1;
                layer.position.y1 = -height / state.height;
                layer.position.y2 = height / state.height;
            } else {
                // 高适配
                let width = state.height * (layer.source.width / layer.source.height);
                layer.position.y1 = -1;
                layer.position.y2 = 1;
                layer.position.x1 = -width / state.width;
                layer.position.x2 = width / state.width;
            }
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