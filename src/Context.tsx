import React, {createContext, useReducer} from "react";
import {ActionType, EditStatus, EditType, Layer, ProcessStatus, StateType} from "./types/type";
import {initLayer, updateLayerProperty, updateLayerSubProperty} from "./lib/util";
import imgSrc from './icons/example.jpg';

let mode = 1;
let image = new Image();
image.src = imgSrc;
let layer = initLayer(image);
layer.position.y1 = -0.7;
layer.position.y2 = 0.7;
layer.position.x1 = -1;
layer.position.x2 = 1;
layer.originPosition.y1 = -0.7;
layer.originPosition.y2 = 0.7;
layer.originPosition.x1 = -1;
layer.originPosition.x2 = 1;


const initialState: StateType = {
    editStatus: mode === 1 ? EditStatus.EDTING : EditStatus.IDLE,
    processStatus: ProcessStatus.none,
    savePicture: false,
    currentLayer: mode === 1 ? layer : null,
    layers: mode === 1 ? [layer] : [

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
            if (state.currentLayer && state.currentLayer.color.editingProperty) {
                return updateLayerSubProperty<"color">(state.currentLayer, state, action.payload, "color", state.currentLayer.color.editingProperty,);
            }
            return state;
        case ActionType.updateColorType:
            if (state.currentLayer) {
                return updateLayerSubProperty<"color">(state.currentLayer, state, action.payload, "color", "editingProperty");
            }
            return state;
        case ActionType.startClipPath:
            if (state.currentLayer) {
                return updateLayerProperty<"editStatus">(state.currentLayer, state, EditType.transform,"editStatus");
            }
            return state;
        case ActionType.finishClipPath:
            if (state.currentLayer) {
                return updateLayerProperty<"editStatus">(state.currentLayer, state, EditType.none,"editStatus");
            }
            return state;
        case ActionType.updateTransform:
            if (state.currentLayer) {
                return updateLayerProperty<"transform">(state.currentLayer, state, action.payload, "transform");
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