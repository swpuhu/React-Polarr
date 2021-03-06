import {useContext, useEffect} from 'react';
import {Context} from "../Context";
import {ActionType, EditStatus} from "../types/type";
import {initLayer} from "./util";
import {usePreProcess} from "../render/usePreProcess";

const useFile = (onChange: (file: File) => void) => {
    const input = document.createElement('input');
    const {dispatch} = useContext(Context);
    const {preProcessAll} = usePreProcess();
    // <input type="file" id="xFile2" capture="camera" multiple="multiple" accept="image/*" class="imgInp1" @change='onUpload2($event)'  style="position:absolute;clip:rect(0 0 0 0); width: 100%; height: 105px; top:0px;" v-if="judgeFan">
    input.type = 'file';
    // input.setAttribute('capture', 'camera');
    // input.setAttribute('accept', 'image/*')
    const changeHandler = () => {

        if (input.files && input.files.length) {
            let file = input.files[0];
            if (/\.png$/.test(file.name) || /\.jpe?g$/.test(file.name) || /\.bmp$/.test(file.name)) {
                let image = document.createElement('img');
                let url = URL.createObjectURL(file);
                image.onload = () => {
                    dispatch({type: ActionType.updateOpenStatus, payload: true});
                    setTimeout(() => {
                        dispatch({type: ActionType.updateFilterStamp, payload: preProcessAll(image)});
                        dispatch({type: ActionType.addLayer, payload: initLayer(image)});
                        dispatch({type: ActionType.updateCanvasSize, payload: {width: image.width, height: image.height}});
                        dispatch({type: ActionType.updateEditStatus, payload: EditStatus.EDTING});
                        dispatch({type: ActionType.updateOpenStatus, payload: false});
                        URL.revokeObjectURL(url);
                    }, 50);
                };
                image.src = url;
            }
            onChange(file);
            input.value = '';
        }
    };
    useEffect(() => {
        input.onchange = changeHandler;
        return () => {
            input.onchange = null
        };
    });
    return {input};
};

export {useFile}