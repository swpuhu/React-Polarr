import React, {useContext} from 'react';
import {Context} from "../../Context";
import {ActionType, Color, Light} from "../../types/type";
import styled from "styled-components";
import {ControlSlider} from "../../components/ControlSlider";
import {Indicator} from "../../components/Indicator";
import {getLastState} from "../../lib/util";
import {mapValue} from "../../render/GLUtil";

const Wrapper = styled.div`
    display: flex;
`;
const OuterWrapper = styled.div`
    position: absolute;
    width: 100%;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
`;

export const LightFilter:React.FC = (props) => {
    const {state: states, dispatch} = useContext(Context);
    const layer = getLastState(states.historyLayers);
    const indicators: {
        type: Exclude<keyof Light, 'editingProperty'> ,
        min: number
        max: number
        value: number,
        label: string,
        onChange: (value: number) => void
    }[] = [
        {
            type: "lightness",
            min: -100,
            max: 100,
            value: layer ? layer.light.lightness : 0,
            label: "亮度",
            onChange: (value) => {
                if (layer) {
                    dispatch({type: ActionType.updateLightValue, payload: {type: "lightness", value: value}});
                }
            }
        },
        {
            type: "contrast",
            min: -100,
            max: 100,
            value: layer ? layer.light.contrast : 0,
            label: "对比度",
            onChange: (value) => {
                if (layer) {
                    dispatch({type: ActionType.updateLightValue, payload: {type: "contrast", value: value}});
                }
            }
        },
        // {
        //     type: "lightPartial",
        //     min: -180,
        //     max: 180,
        //     value: layer ? layer.light.lightPartial: 0,
        //     label: "亮部",
        //     onChange: (value) => {
        //         if (layer) {
        //             dispatch({type: ActionType.updateLightValue, payload: {type: "lightPartial", value: value}});
        //         }
        //     }
        // },
        // {
        //     type: "darkPartial",
        //     min: -100,
        //     max: 100,
        //     value: layer ? layer.light.darkPartial : 0,
        //     label: "暗部",
        //     onChange: (value) => {
        //         if (layer) {
        //             dispatch({type: ActionType.updateLightValue, payload: {type: "darkPartial", value: value}});
        //         }
        //     }
        // }
    ];

    return (
        <OuterWrapper>
            {
                indicators.map(item => {
                    let isShow = false;
                    if (layer && layer.light.editingProperty === item.type) {
                        isShow = true;
                    }
                    return isShow ? <ControlSlider className={isShow ? '' : 'hide'} key={item.type} onChange={item.onChange} value={item.value} min={item.min} max={item.max} step={1} label={item.label}/> : null
                })
            }
            <Wrapper>
                {indicators.map(item => {
                    return <Indicator key={item.type}
                                      value={layer ? layer.light[item.type] : 0}
                                      onClick={() => dispatch({type: ActionType.updateLightType, payload: item.type})}
                                      min={item.min}
                                      max={item.max}
                                      label={item.label}
                                      isActive={layer ? layer.light.editingProperty === item.type : false}
                                      className={item.type}/>
                })}
            </Wrapper>

        </OuterWrapper>
    )
};