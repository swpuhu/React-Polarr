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
    text-shadow: 1px 1px 2px #000;
    &.active {
        border: 2px solid #ffffff;
        .valueWrapper {
            background: #00000011;
        }
    }
    > .flex {
        display: flex;
        width: 100%;
        height: 100%;
        flex-direction: column;
        position: relative;
        justify-content: space-between;
        padding: 3px;
    }
    > .mask {
        position: absolute;
        z-index: 1;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        > .valueWrapper {
            height: 100%;
            display: flex;
            flex-direction: column;
            > .hide {
                visibility: hidden;
            }
            > .value {
                flex: 1;
                line-height: 30px;
                text-align: center;
            }
            > .label {
                text-align: center;
                background: rgba(255, 255, 255, 0.3);
            }
        
        }
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
export const FilterIndicator: React.FC<Props> = (props) => {
    let mid = (props.min + props.max) / 2;
    let halfRange = (props.max - props.min) / 2;
    let percent = props.value > mid ? props.value / halfRange : -props.value / halfRange;
    percent *= 100;
    let showValue = (
        <div className="valueWrapper">
            <div className={"value" + (props.isActive ? '' : ' hide')}>
                {props.value}
            </div>
            <div className="label">
                {props.label}
            </div>
        </div>
    );
    return (
        <Wrapper onClick={props.onClick} className={cs(props.className, props.isActive ? 'active' : '')}>
            <div className="flex">
            </div>
            <div className="mask">
                {showValue}
            </div>
        </Wrapper>
    )
};