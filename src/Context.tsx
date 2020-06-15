import React, {createContext, useReducer} from "react";
import {ActionType, EditStatus, EditType, Layer, Position, ProcessStatus, StateType} from "./types/type";
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
            if (state.currentLayer) {
                return updateLayerSubProperty<"color">(state.currentLayer, state, action.payload.value, "color", action.payload.type);
            }
            return state;
        case ActionType.updateColorType:
            if (state.currentLayer) {
                return updateLayerSubProperty<"color">(state.currentLayer, state, action.payload, "color", "editingProperty");
            }
            return state;
        case ActionType.updateEffectValue:
            if (state.currentLayer) {
                return updateLayerSubProperty<"effect">(state.currentLayer, state, action.payload.value, "effect", action.payload.type);
            }
            return state;
        case ActionType.updateEffectType:
            if (state.currentLayer) {
                return updateLayerSubProperty<"effect">(state.currentLayer, state, action.payload, "effect", "editingProperty");
            }
            return state;
        case ActionType.updateFilterSubType:
            if (state.currentLayer) {
                return updateLayerSubProperty<"filter">(state.currentLayer, state, action.payload, "filter", "type");
            }
            return state;
        case ActionType.updateFilterIntensity:
            if (state.currentLayer) {
                return updateLayerSubProperty<"filter">(state.currentLayer, state, action.payload, "filter", "intensity");
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
        case ActionType.updatePosition:
            if (state.currentLayer) {
                let w = (1 - state.currentLayer.transform.left - state.currentLayer.transform.right) * (state.currentLayer.originPosition.x2 - state.currentLayer.originPosition.x1);
                let h = (1 - state.currentLayer.transform.top - state.currentLayer.transform.bottom) * (state.currentLayer.originPosition.y2 - state.currentLayer.originPosition.y1);
                let wPx = w * screenWidth;
                let hPx = h * screenHeight;
                let position: Position = {
                    x1: -1,
                    x2: 1,
                    y1: -1,
                    y2: 1
                };
                // console.log(wPx, hPx);
                if (wPx / hPx > screenWidth / screenHeight) {
                    // 宽适配
                    let scale = 2 / w;
                    position.y2 = h / 2 * scale;
                    position.y1 = -h / 2 * scale;
                } else {
                    // 高适配
                    let scale = 2 / h;
                    position.x2 = w / 2 * scale;
                    position.x1 = -w / 2 * scale;
                }
                return updateLayerProperty<"position">(state.currentLayer, state, position, "position");
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