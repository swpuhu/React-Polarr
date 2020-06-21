import React, {createContext, useReducer} from "react";
import {ActionType, EditStatus, EditType, Layer, Position, ProcessStatus, StateType} from "./types/type";
import {clone, getLastStateIndex, initLayer, objIsEqual, updateLayerProperty, updateLayerSubProperty} from "./lib/util";
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
};

const initialState: StateType = {
    historyType: null,
    editStatus: EditStatus.IDLE,
    transformStatus: EditType.none,
    processStatus: ProcessStatus.none,
    savePicture: false,
    openStatus: false,
    historyLayers: [],
    width: window.innerWidth,
    height: window.innerHeight - 92,
    filterStamp: filterStamp,
    showAllFilter: false
};
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight - 92;

const reducer = (state: typeof initialState, action: {type: ActionType, payload: any}) => {
    let layer: Layer;
    let lastState, newState;
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
            
            layer.historyType = '打开文件';
            return {
                ...state,
                historyLayers: [layer],
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
                savePicture: false,
            };
        case ActionType.updateColorValue:
            if (state.historyLayers[state.historyLayers.length - 1]) {
                let index = getLastStateIndex(state.historyLayers);
                state.historyLayers[index] = updateLayerSubProperty<"color">(state.historyLayers[index], action.payload.value, "color", action.payload.type);
                return {
                    ...state
                };
            }
            return state;
        case ActionType.updateColorType:
            if (state.historyLayers[state.historyLayers.length - 1]) {
                let index = getLastStateIndex(state.historyLayers);
                state.historyLayers[index] = updateLayerSubProperty<"color">(state.historyLayers[index], action.payload, "color", "editingProperty");
                return {...state};
            }
            return state;

        case ActionType.updateLightValue:
            if (state.historyLayers[state.historyLayers.length - 1]) {
                let index = getLastStateIndex(state.historyLayers);
                state.historyLayers[index] = updateLayerSubProperty<"light">(state.historyLayers[index], action.payload.value, "light", action.payload.type);
                return {
                    ...state
                };
            }
            return state;
        case ActionType.updateLightType:
            if (state.historyLayers[state.historyLayers.length - 1]) {
                let index = getLastStateIndex(state.historyLayers);
                state.historyLayers[index] = updateLayerSubProperty<"light">(state.historyLayers[index], action.payload, "light", "editingProperty");
                return {...state};
            }
            return state;
        case ActionType.updateEffectValue:
            if (state.historyLayers[state.historyLayers.length - 1]) {
                let index = getLastStateIndex(state.historyLayers);
                state.historyLayers[index] = updateLayerSubProperty<"effect">(state.historyLayers[index], action.payload.value, "effect", action.payload.type);
                return {...state};
            }
            return state;
        case ActionType.updateEffectType:
            if (state.historyLayers[state.historyLayers.length - 1]) {
                let index = getLastStateIndex(state.historyLayers);
                state.historyLayers[index] = updateLayerSubProperty<"effect">(state.historyLayers[index], action.payload, "effect", "editingProperty");
                return {...state};
            }
            return state;
        case ActionType.updateFilterSubType:
            if (state.historyLayers[state.historyLayers.length - 1]) {
                let index = getLastStateIndex(state.historyLayers);
                state.historyLayers[index] = updateLayerSubProperty<"filter">(state.historyLayers[index], action.payload, "filter", "type");
                return {...state};
            }
            return state;
        case ActionType.updateFilterCategory:
            if (state.historyLayers[state.historyLayers.length - 1]) {
                let index = getLastStateIndex(state.historyLayers);
                state.historyLayers[index] = updateLayerSubProperty<"filter">(state.historyLayers[index], action.payload, "filter", "currentCategory");
                return {...state};
            }
            return state;
        case ActionType.updateFilterIntensity:
            if (state.historyLayers[state.historyLayers.length - 1]) {
                let index = getLastStateIndex(state.historyLayers);
                state.historyLayers[index] = updateLayerSubProperty<"filter">(state.historyLayers[index], action.payload, "filter", "intensity");
                return {...state};
            }
            return state;
        case ActionType.startClipPath:
            return {
                ...state,
                transformStatus: EditType.transform
            };
        case ActionType.finishClipPath:
            return {
                ...state,
                transformStatus: EditType.none
            };
        case ActionType.updateTransform:
            if (state.historyLayers[state.historyLayers.length - 1]) {
                let index = getLastStateIndex(state.historyLayers);
                state.historyLayers[index] = updateLayerProperty<"transform">(state.historyLayers[index], action.payload, "transform");
                return {...state};
            }
            return state;
        case ActionType.updatePosition:
            if (state.historyLayers[state.historyLayers.length - 1]) {
                const prev = state.historyLayers[state.historyLayers.length - 1];
                if (!prev) return;
                let w = (1 - prev.transform.left - prev.transform.right) * (prev.originPosition.x2 - prev.originPosition.x1);
                let h = (1 - prev.transform.top - prev.transform.bottom) * (prev.originPosition.y2 - prev.originPosition.y1);
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
                let index = getLastStateIndex(state.historyLayers);
                state.historyLayers[index] = updateLayerProperty<"position">(state.historyLayers[index], position, "position");
                return {...state};
            }
            return state;
        case ActionType.updateFilterStamp:
            return {
                ...state,
                filterStamp: action.payload
            };
        case ActionType.updateOpenStatus:
            return {
                ...state,
                openStatus: action.payload
            }
        case ActionType.updateShowAllFilter:
            return {
                ...state,
                showAllFilter: action.payload
            };
        case ActionType.addHistory:
            lastState = clone(state.historyLayers[getLastStateIndex(state.historyLayers)]);
            lastState.historyType = action.payload;
            lastState.trackable = true;
            newState = {
                ...state,
                historyLayers: [
                    ...state.historyLayers,
                    lastState
                ].filter(item => item.trackable)
            };
            while (newState.historyLayers.length > 50) {
                newState.historyLayers.shift();
            }
            return newState;
        case ActionType.backTrackHistory:
            return {
                ...state,
                historyLayers: state.historyLayers.map((item, ix)=> {
                    item.trackable = ix <= (action.payload as number);
                    return item;
                })
            };
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