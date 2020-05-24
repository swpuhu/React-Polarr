import React, {createContext, useReducer} from "react";

const initialState = {
    color: 'blue'
};
export const ColorContext = createContext({state: initialState , dispatch: (action: {type: ActionType, payload: any}) => {}});

export enum ActionType {
    UPDATE_COLOR
}

const reducer = (state: typeof initialState, action: {type: ActionType, payload: any}) => {
    switch (action.type) {
        case ActionType.UPDATE_COLOR:
            return {
                ...state,
                color: action.payload
            };
        default:
            return state;
    }
};


export const Color: React.FC = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <ColorContext.Provider value={{state: state, dispatch}}>
            {props.children}
        </ColorContext.Provider>
    )
}
