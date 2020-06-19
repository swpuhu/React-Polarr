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
    background: #00000066;
`;

export const EffectFilter:React.FC = (props) => {
    const {state: states, dispatch} = useContext(Context);
    const state = getLastState(states);
    const indicators: {
        type: 'colorOffset'
        min: number
        max: number
        value: number,
        label: string,
        onChange: (value: number) => void
    }[] = [
        {
            type: "colorOffset",
            min: -100,
            max: 100,
            value: state.currentLayer ? state.currentLayer.effect.colorOffset : 0,
            label: "色差强度",
            onChange: (value) => {
                if (state.currentLayer) {
                    dispatch({type: ActionType.updateEffectValue, payload: {type: "colorOffset", value: value}});
                }
            }
        }
    ];

    return (
        <OuterWrapper>
            {
                indicators.map(item => {
                    let isShow = false;
                    if (state.currentLayer && state.currentLayer.effect.editingProperty === item.type) {
                        isShow = true;
                    }
                    return isShow ? <ControlSlider className={isShow ? '' : 'hide'} key={item.type} onChange={item.onChange} value={item.value} min={item.min} max={item.max} step={1}/> : null
                })
            }
            <Wrapper>
                {indicators.map(item => {
                    return <Indicator key={item.type}
                                      value={state.currentLayer ? state.currentLayer.effect[item.type] : 0}
                                      onClick={() => dispatch({type: ActionType.updateEffectType, payload: item.type})}
                                      min={item.min}
                                      max={item.max}
                                      label={item.label}
                                      isActive={state.currentLayer ? state.currentLayer.effect.editingProperty === item.type : false}
                                      className={item.type}/>
                })}
            </Wrapper>

        </OuterWrapper>
    )
};