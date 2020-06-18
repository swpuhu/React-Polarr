import React, {createContext, useReducer} from "react";
import {ActionType, EditStatus, EditType, Layer, Position, ProcessStatus, StateType} from "./types/type";
import {initLayer, updateLayerProperty, updateLayerSubProperty} from "./lib/util";
import imgSrc from './icons/example.jpg';

let mode = 0;
let layer = null;
if (mode) {
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
}

export const filterStamp = {
    'normal': '',
    'flowerStone': '',
    'fluorite': '',
    'fluoriteBlue': '',
    'fluoriteVenus': '',
    'fuchsite': '',
    'talc': '',
    'tanzanite': '',
    'tektite': '',
    'thulite': '',
    'obsidian': '',
    'okenite': '',
    'oligoclase': '',
    'onyx': '',
    'opal': '',
    'opalite': '',
    'orpiment': '',
    'pearl': '',
    'peridot': '',
    'petalite': '',
}

const initialState: StateType[] = [{
    editStatus: mode === 1 ? EditStatus.EDTING : EditStatus.IDLE,
    processStatus: ProcessStatus.none,
    savePicture: false,
    openStatus: false,
    currentLayer: mode === 1 ? layer : null,
    width: window.innerWidth,
    height: window.innerHeight - 92,
    filterStamp: filterStamp,
    showAllFilter: false
}];
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight - 92;

const reducer = (state: typeof initialState, action: {type: ActionType, payload: any}) => {
    let layer: Layer;
    let lastState;
    switch (action.type) {
        case ActionType.updateEditStatus:
            lastState = state[state.length - 1];
            lastState.editStatus = action.payload;
            return [...state];
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
            lastState = state[state.length - 1];
            lastState.currentLayer = layer;
            return [...state];
        case ActionType.updateCanvasSize:
            lastState = state[state.length - 1];
            lastState.width = action.payload.width;
            lastState.height = action.payload.height;
            return [...state];
        case ActionType.savePicture:
            lastState = state[state.length - 1];
            lastState.savePicture = true;
            return [...state];
        case ActionType.finishSavePicture:
            lastState = state[state.length - 1];
            lastState.savePicture = false;
            return [...state];
        case ActionType.updateColorValue:
            if (state[state.length - 1]) {
                const lastState =  updateLayerSubProperty<"color">(state[state.length - 1], action.payload.value, "color", action.payload.type);


                state.slice(state.length - 1).push(lastState);
                return state;
            }
            return state;
        case ActionType.updateColorType:
            if (state[state.length - 1]) {
                const lastState = updateLayerSubProperty<"color">(state[state.length - 1], action.payload, "color", "editingProperty");


                state.slice(state.length - 1).push(lastState);
                return state;
            }
            return state;
        case ActionType.updateEffectValue:
            if (state[state.length - 1]) {
                const lastState = updateLayerSubProperty<"effect">(state[state.length - 1], action.payload.value, "effect", action.payload.type);


                state.slice(state.length - 1).push(lastState);
                return state;
            }
            return state;
        case ActionType.updateEffectType:
            if (state[state.length - 1]) {
                const lastState = updateLayerSubProperty<"effect">(state[state.length - 1], action.payload, "effect", "editingProperty");


                state.slice(state.length - 1).push(lastState);
                return state;
            }
            return state;
        case ActionType.updateFilterSubType:
            if (state[state.length - 1]) {
                const lastState = updateLayerSubProperty<"filter">(state[state.length - 1], action.payload, "filter", "type");


                state.slice(state.length - 1).push(lastState);
                return state;
            }
            return state;
        case ActionType.updateFilterCategory:
            if (state[state.length - 1]) {
                const lastState = updateLayerSubProperty<"filter">(state[state.length - 1], action.payload, "filter", "currentCategory");

                state.slice(state.length - 1).push(lastState);
                return state;
            }
            return state;
        case ActionType.updateFilterIntensity:
            if (state[state.length - 1]) {
                const lastState = updateLayerSubProperty<"filter">(state[state.length - 1], action.payload, "filter", "intensity");

                state.slice(state.length - 1).push(lastState);
                return state;
            }
            return state;
        case ActionType.startClipPath:
            if (state[state.length - 1]) {
                const lastState = updateLayerProperty<"editStatus">(state[state.length - 1], EditType.transform,"editStatus");

                state.slice(state.length - 1).push(lastState);
                return state;
            }
            return state;
        case ActionType.finishClipPath:
            if (state[state.length - 1]) {
                const lastState = updateLayerProperty<"editStatus">(state[state.length - 1], EditType.none,"editStatus");


                state.slice(state.length - 1).push(lastState);
                return state;
            }
            return state;
        case ActionType.updateTransform:
            if (state[state.length - 1]) {
                const lastState = updateLayerProperty<"transform">(state[state.length - 1], action.payload, "transform");

                state.slice(state.length - 1).push(lastState);
                return state;
            }
            return state;
        case ActionType.updatePosition:
            if (state[state.length - 1]) {
                const prev = state[state.length - 1];
                if (!prev.currentLayer) return;
                let w = (1 - prev.currentLayer.transform.left - prev.currentLayer.transform.right) * (prev.currentLayer.originPosition.x2 - prev.currentLayer.originPosition.x1);
                let h = (1 - prev.currentLayer.transform.top - prev.currentLayer.transform.bottom) * (prev.currentLayer.originPosition.y2 - prev.currentLayer.originPosition.y1);
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
                const lastState =  updateLayerProperty<"position">(state[state.length - 1], position, "position");


                state.slice(state.length - 1).push(lastState);
                return state;
            }
            return state;
        case ActionType.updateFilterStamp:
            lastState = state[state.length - 1];
            lastState.openStatus = false;
            lastState.filterStamp = action.payload;
            return [...state];
        case ActionType.updateOpenStatus:
            lastState = state[state.length - 1];
            lastState.openStatus = action.payload;
            return [...state];
        case ActionType.updateShowAllFilter:
            lastState = state[state.length - 1];
            lastState.showAllFilter = action.payload;
            return [...state];
        default:
            return state;
    }
};


export const Context = createContext({state: initialState , dispatch: (_action: {type: ActionType, payload: any}) => {}});

export const Provider:React.FC = (props) => {
    // @ts-ignore
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <Context.Provider value={{state: state, dispatch}}>
            {props.children}
        </Context.Provider>
    )
};