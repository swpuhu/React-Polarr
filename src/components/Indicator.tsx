import React from 'react';
import styled from "styled-components";

const Wrapper = styled.div`
    display: inline-block;
    width: 70px;
    height: 70px;
    background: #f60;
    border-radius: 5px;
    border: 1px solid #fff;
    &.temperature {
        background: linear-gradient(45deg, #f60, #fff, #06f);
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
`;
type Props = {
    value: number
    min: number
    max: number
    label: string
    className: string
}
export const Indicator:React.FC<Props> = (props) => {
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
            <div className="mask"/>
        </Wrapper>
    )
}