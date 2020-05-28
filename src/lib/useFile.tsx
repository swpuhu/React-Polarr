import React, {useContext, useEffect} from 'react';
import {Context} from "../Context";
import {ActionType, EditStatus} from "../types/type";
import {initLayer} from "./util";

const useFile = (onChange: (file: File) => void) => {
    const input = document.createElement('input');
    const {state, dispatch} = useContext(Context);
    input.type = 'file';
    const changeHandler = () => {
        if (input.files && input.files.length) {
            let file = input.files[0];
            if (/\.png$/.test(file.name) || /\.jpe?g$/.test(file.name) || /\.bmp$/.test(file.name)) {
                let image = document.createElement('img');
                let url = URL.createObjectURL(file);
                image.onload = () => {
                    dispatch({type: ActionType.addLayer, payload: initLayer(image)});
                    dispatch({type: ActionType.updateCanvasSize, payload: {width: image.width, height: image.height}});
                    dispatch({type: ActionType.updateEditStatus, payload: EditStatus.EDTING});
                    URL.revokeObjectURL(url);
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