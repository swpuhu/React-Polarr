import React, {useContext, useEffect} from 'react';
import {Context} from "../Context";
import {ActionType, EditStatus} from "../types/type";

const useFile = (onChange: (file: File) => void) => {
    const input = document.createElement('input');
    const {state, dispatch} = useContext(Context);
    input.type = 'file';
    const changeHandler = () => {
        if (input.files && input.files.length) {
            let file = input.files[0];
            onChange(file);
            dispatch({type: ActionType.updateEditStatus, payload: EditStatus.EDTING});
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