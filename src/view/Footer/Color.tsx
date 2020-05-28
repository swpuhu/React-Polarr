import React, {useContext} from 'react';
import {SliderWithIndicator} from '../../components/SliderWithIndicator';
import {Context} from "../../Context";
import {ActionType} from "../../types/type";

export const Color:React.FC = (props) => {
    const {state, dispatch} = useContext(Context);

    return (
        <div>
            <SliderWithIndicator label={"色温"} min={-100} max={100} value={state.currentLayer ? state.currentLayer.color.temperature : 0} step={1} onChange={(value: number) => {
                dispatch({type: ActionType.updateTemperature, payload: value});
            }}/>
        </div>
    )
};