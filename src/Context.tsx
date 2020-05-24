import React, {createContext, useReducer} from "react";
import {ActionType, EditStatus} from "./types/type";


const initialState = {
    editStatus: EditStatus.IDLE
};

const reducer = (state: typeof initialState, action: {type: ActionType, payload: any}) => {
    switch (action.type) {
        case ActionType.updateEditStatus:
            return {
                ...state,
                editStatus: action.payload
            };
        default:
            return state;
    }
};

export const Context = createContext({state: initialState , dispatch: (action: {type: ActionType, payload: any}) => {}});

export const Provider:React.FC = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <Context.Provider value={{state: state, dispatch}}>
            {props.children}
        </Context.Provider>
    )
};