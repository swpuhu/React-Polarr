import React from 'react';
import styled from "styled-components";

const Wrapper = styled.div`
    display: inline-block;
    position: relative;
    width: 70px;
    height: 70px;
    background: #f60;
    border-radius: 5px;
    border: 1px solid #fff;
    &.temperature {
        background: linear-gradient(45deg, #f60, #06f);
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
}
export const Indicator:React.FC<Props> = (props) => {
    let mid = (props.min + props.max) / 2;
    let halfRange = (props.max - props.min) / 2;
    let percent = props.value > mid ? props.value / halfRange: -props.value / halfRange;
    percent *= 100;
    return (
        <Wrapper className={props.className}>
            <div className="flex">
                <div className="value">
                    {props.value}
                </div>
                <div>
                    {props.label}
                </div>
            </div>
            <div className="mask" style={{
                clipPath: props.value > mid ? `polygon(0% 0%, ${percent}% 0%, 100% ${100 - percent}%, 100% 100%, 0% 0%)` : `polygon(0% 0%, 0% ${percent}%, ${100 - percent}% 100%, 100% 100%, 0% 0%)`
            }}/>
        </Wrapper>
    )
}