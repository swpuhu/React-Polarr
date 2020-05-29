import React, {useContext} from 'react';
import {Context} from "../../Context";
import {ActionType, Color} from "../../types/type";
import styled from "styled-components";
import {ControlSlider} from "../../components/ControlSlider";
import {Indicator} from "../../components/Indicator";

const Wrapper = styled.div`
    display: flex;
`;
const OuterWrapper = styled.div`
    position: absolute;
    width: 100%;
    bottom: 0;
    background: #00000066;
`;

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
            label: "色温",
        },
        {
            type: "tint",
            min: -100,
            max: 100,
            label: "色调",
        },
        {
            type: "hue",
            min: -180,
            max: 180,
            label: "色相",
        },
        {
            type: "saturation",
            min: -100,
            max: 100,
            label: "饱和度",
        }
    ];

    return (
        <OuterWrapper>
            <ControlSlider onChange={onChange} min={getMinMax().min} max={getMinMax().max} value={getValue()} step={1}/>
            <Wrapper>
                {indicators.map(item => {
                    return <Indicator key={item.type}
                                      value={state.currentLayer ? state.currentLayer.color[item.type] : 0}
                                      onClick={() => dispatch({type: ActionType.updateColorType, payload: item.type})}
                                      min={item.min}
                                      max={item.max}
                                      label={item.label}
                                      isActive={state.currentLayer ? state.currentLayer.color.editingProperty === item.type : false}
                                      className={item.type}/>
                })}
            </Wrapper>

        </OuterWrapper>
    )
};