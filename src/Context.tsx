import React, {createContext, useReducer} from "react";
import {ActionType, EditStatus, Layer, ProcessStatus, StateType} from "./types/type";


const initialState: StateType = {
    editStatus: EditStatus.IDLE,
    processStatus: ProcessStatus.none,
    savePicture: false,
    currentLayer: null,
    layers: [

    ],
    width: window.innerWidth,
    height: window.innerHeight - 92,
};
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight - 92;

const reducer = (state: typeof initialState, action: {type: ActionType, payload: any}) => {
    let layer: Layer;
    switch (action.type) {
        case ActionType.updateEditStatus:
            return {
                ...state,
                editStatus: action.payload
            };
        case ActionType.addLayer:
            layer = action.payload as Layer;
            if (layer.source.width / layer.source.height > screenWidth / screenHeight) {
                // 宽适配
                let height = screenWidth / (layer.source.width / layer.source.height);
                layer.position.x1 = -1;
                layer.position.x2 = 1;
                layer.position.y1 = -height / screenHeight;
                layer.position.y2 = height / screenHeight;
                layer.originPosition.x1 = layer.position.x1;
                layer.originPosition.x2 = layer.position.x2;
                layer.originPosition.y1 = layer.position.y1;
                layer.originPosition.y2 = layer.position.y2;
            } else {
                // 高适配
                let width = screenHeight * (layer.source.width / layer.source.height);
                layer.position.y1 = -1;
                layer.position.y2 = 1;
                layer.position.x1 = -width / screenWidth;
                layer.position.x2 = width / screenWidth;
                layer.originPosition.x1 = layer.position.x1;
                layer.originPosition.x2 = layer.position.x2;
                layer.originPosition.y1 = layer.position.y1;
                layer.originPosition.y2 = layer.position.y2;
            }
            return {
                ...state,
                currentLayer: layer,
                layers: [
                    layer
                ]
            };
        case ActionType.updateCanvasSize:
            return {
                ...state,
                width: action.payload.width,
                height: action.payload.height
            };
        case ActionType.savePicture:
            return {
                ...state,
                savePicture: true
            };
        case ActionType.finishSavePicture:
            return {
                ...state,
                savePicture: false
            };
        case ActionType.updateColorValue:
            if (state.currentLayer) {
                let index = state.layers.indexOf(state.currentLayer);
                let newLayer = {...state.currentLayer};
                if (newLayer.color.editingProperty) {
                    newLayer.color[newLayer.color.editingProperty] = action.payload;
                }
                return {
                    ...state,
                    currentLayer: newLayer,
                    layers: state.layers.map((layer, i) => {
                        if (index === i) {
                            return newLayer;
                        }
                        return layer;
                    })
                };
            }
            return state;
        case ActionType.updateColorType:
            if (state.currentLayer) {
                let index = state.layers.indexOf(state.currentLayer);
                let newLayer = {...state.currentLayer};
                newLayer.color.editingProperty = action.payload;
                return {
                    ...state,
                    currentLayer: newLayer,
                    layers: state.layers.map((layer, i) => {
                        if (index === i) {
                            return newLayer;
                        }
                        return layer;
                    })
                };
            }
            return state;
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