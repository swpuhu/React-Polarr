import React, {useContext} from 'react';
import {Context} from "../../Context";
import {ActionType, Color} from "../../types/type";
import styled from "styled-components";
import {ControlSlider} from "../../components/ControlSlider";
import {Indicator} from "../../components/Indicator";
import {getLastState} from "../../lib/util";

const Wrapper = styled.div`
    display: flex;
`;
const OuterWrapper = styled.div`
    position: absolute;
    width: 100%;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
`;

export const ColorFilter:React.FC = (props) => {
    const {state: states, dispatch} = useContext(Context);
    const layer = getLastState(states.historyLayers);
    const indicators: {
        type: Exclude<keyof Color, 'editingProperty'>,
        min: number
        max: number
        value: number,
        label: string,
        onChange: (value: number) => void
    }[] = [
        {
            type: "temperature",
            min: -100,
            max: 100,
            value: layer ? layer.color.temperature : 0,
            label: "色温",
            onChange: (value) => {
                if (layer) {
                    dispatch({type: ActionType.updateColorValue, payload: {type: "temperature", value: value}});
                }
            }
        },
        {
            type: "tint",
            min: -100,
            max: 100,
            value: layer ? layer.color.tint : 0,
            label: "色调",
            onChange: (value) => {
                if (layer) {
                    dispatch({type: ActionType.updateColorValue, payload: {type: "tint", value: value}});
                }
            }
        },
        {
            type: "hue",
            min: -180,
            max: 180,
            value: layer ? layer.color.hue : 0,
            label: "色相",
            onChange: (value) => {
                if (layer) {
                    dispatch({type: ActionType.updateColorValue, payload: {type: "hue", value: value}});
                }
            }
        },
        {
            type: "saturation",
            min: -100,
            max: 100,
            value: layer ? layer.color.saturation : 0,
            label: "饱和度",
            onChange: (value) => {
                if (layer) {
                    dispatch({type: ActionType.updateColorValue, payload: {type: "saturation", value: value}});
                }
            }
        }
    ];

    return (
        <OuterWrapper>
            {
                indicators.map(item => {
                    let isShow = false;
                    if (layer && layer.color.editingProperty === item.type) {
                        isShow = true;
                    }
                    return isShow ? <ControlSlider className={isShow ? '' : 'hide'} key={item.type} onChange={item.onChange} value={item.value} min={item.min} max={item.max} step={1} label={item.label}/> : null
                })
            }
            <Wrapper>
                {indicators.map(item => {
                    return <Indicator key={item.type}
                                      value={layer ? layer.color[item.type] : 0}
                                      onClick={() => dispatch({type: ActionType.updateColorType, payload: item.type})}
                                      min={item.min}
                                      max={item.max}
                                      label={item.label}
                                      isActive={layer ? layer.color.editingProperty === item.type : false}
                                      className={item.type}/>
                })}
            </Wrapper>

        </OuterWrapper>
    )
};