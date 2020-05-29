import React, {useContext} from 'react';
import {Context} from "../../Context";
import {ActionType, Color} from "../../types/type";
import styled from "styled-components";
import {ControlSlider} from "../../components/ControlSlider";
import {Indicator} from "../../components/Indicator";

const Wrapper = styled.div`
    display: flex;
`

export const ColorFilter:React.FC = (props) => {
    const {state, dispatch} = useContext(Context);
    const onChange = (value: number) => {
        if (state.currentLayer) {
            dispatch({type: ActionType.updateColorValue, payload: value});
        }
    };
    const getValue = () => {
        if (state.currentLayer) {
            if (state.currentLayer.color.editingProperty) {
                return state.currentLayer.color[state.currentLayer.color.editingProperty];
            }
        }
        return 0;
    };

    const getMinMax = () => {
        if (state.currentLayer) {
            if (state.currentLayer.color.editingProperty) {
                let obj = indicators.find(item => state.currentLayer && item.type === state.currentLayer.color.editingProperty);
                if (obj) {
                    return {
                        min: obj.min,
                        max: obj.max
                    }
                }
            }
        }
        return {
            min: -100,
            max: 100
        }

    };
    const indicators: {
        type: Exclude<keyof Color, 'editingProperty'>,
        min: number
        max: number
        label: string
    }[] = [
        {
            type: "temperature",
            min: -100,
            max: 100,
            label: "色温"
        },
        {
            type: "tint",
            min: -100,
            max: 100,
            label: "色调"
        },
        {
            type: "hue",
            min: -180,
            max: 180,
            label: "色相"
        }
    ];

    return (
        <div>
            <ControlSlider onChange={onChange} min={getMinMax().min} max={getMinMax().max} value={getValue()} step={1}/>
            <Wrapper>
                {indicators.map(item => {
                    return <Indicator key={item.type}
                                      value={state.currentLayer ? state.currentLayer.color[item.type] : 0}
                                      onClick={() => dispatch({type: ActionType.updateColorType, payload: item.type})}
                                      min={item.min}
                                      max={item.max}
                                      label={item.label}
                                      className={item.type}/>
                })}
                {/*<Indicator className={"temperature"}*/}
                {/*           onClick={() => dispatch({type: ActionType.updateColorType, payload: 'temperature'})}*/}
                {/*           value={state.currentLayer ? state.currentLayer.color.temperature : 0}*/}
                {/*           min={-100}*/}
                {/*           max={100}*/}
                {/*           label={"色温"}/>*/}

                {/*<Indicator className={"tint"}*/}
                {/*           onClick={() => dispatch({type: ActionType.updateColorType, payload: 'tint'})}*/}
                {/*           value={state.currentLayer ? state.currentLayer.color.tint : 0}*/}
                {/*           min={-100}*/}
                {/*           max={100}*/}
                {/*           label={"色调"}/>*/}


                {/*<Indicator className={"hue"}*/}
                {/*           onClick={() => dispatch({type: ActionType.updateColorType, payload: 'hue'})}*/}
                {/*           value={state.currentLayer ? state.currentLayer.color.hue : 0}*/}
                {/*           min={-180}*/}
                {/*           max={180}*/}
                {/*           label={"色相"}/>*/}
            </Wrapper>

        </div>
    )
};