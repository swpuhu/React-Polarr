import React from 'react';
import styled from "styled-components";
import cs from 'classnames';

const Wrapper = styled.div`
    display: inline-block;
    position: relative;
    margin: 5px;
    width: 70px;
    height: 70px;
    background: #f60;
    border-radius: 5px;
    border: 1px solid #fff;
    text-shadow: 1px 1px 2px #000;
    &.active {
        border: 2px solid #ffffff;
        box-shadow: 1px 1px 2px #ffffff;
    }
    &.temperature {
        background: linear-gradient(45deg, #06f, #f60);
    }
    &.tint {
        background: linear-gradient(45deg, #00ff14, #ff0fdb);
    }
    &.hue {
        background: linear-gradient(45deg, red 0, #ff0 17%, lime 33%, cyan 50%, blue 67%, #f0f 83%, red);
    }
    &.saturation {
        background: linear-gradient(45deg,#000000,#ff6600);
    }
    &.colorOffset {
        background: linear-gradient(45deg,#929292,#0095ff);
    }
    
    &.lightness {
        background: linear-gradient(45deg,#000000, #ffffff);
    }
    
    &.contrast {
        background: linear-gradient(45deg,#333, #cccccc, #333,  #cccccc, #333,  #cccccc);
    }
    
    &.lightPartial {
        background: linear-gradient(45deg,#333, #eee);
    }
    
    &.darkPartial {
        background: linear-gradient(45deg,#222, #888);
    }
    
    > .flex {
        display: flex;
        width: 100%;
        height: 100%;
        flex-direction: column;
        position: relative;
        justify-content: space-between;
        padding: 3px;
        > .value {
            text-align: right;
        }
    }
    > .mask {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: #ffffff33;
    }
`;
type Props = {
    value: number
    min: number
    max: number
    label: string
    className: string
    isActive: boolean
    onClick?: () => void
}
export const Indicator:React.FC<Props> = (props) => {
    // let mid = (props.min + props.max) / 2;
    // let halfRange = (props.max - props.min) / 2;
    // let percent = props.value > mid ? props.value / halfRange: -props.value / halfRange;
    // percent *= 100;
    return (
        <Wrapper onClick={props.onClick} className={cs(props.className, props.isActive ? 'active' : '')}>
            <div className="flex">
                <div className="value">
                    {props.value}
                </div>
                <div>
                    {props.label}
                </div>
            </div>
            {/*<div className="mask" style={{*/}
            {/*    clipPath: props.value > mid ? `polygon(0% 0%, ${percent}% 0%, 100% ${100 - percent}%, 100% 100%, 0% 0%)` : `polygon(0% 0%, 0% ${percent}%, ${100 - percent}% 100%, 100% 100%, 0% 0%)`,*/}
            {/*}}/>*/}
        </Wrapper>
    )
}