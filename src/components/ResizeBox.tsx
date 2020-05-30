import React, {useContext} from 'react';
import {Context} from "../Context";
import styled from "styled-components";
import {mapValue} from "../render/GLUtil";

const border = 4;
const Wrapper = styled.div`
    position: absolute;
`;
const InnerWrapper = styled.div`
    position: absolute;
    left: ${border}px;
    right: ${border}px;
    top: ${border}px;
    bottom: ${border}px;
    border: 2px solid #ffffff;
`;
const V1 = styled.div`
    position: absolute;
    height: 1px;
    width: 100%;
    background: #fff;
    top: 33%;
    left: 0;
`;
const V2 = styled.div`
    position: absolute;
    height: 1px;
    width: 100%;
    background: #fff;
    top: 66%;
    left: 0;
`;

const H1 = styled.div`
    position: absolute;
    width: 1px;
    height: 100%;
    background: #fff;
    left: 33%;
    top: 0;

`;

const H2 = styled.div`
    position: absolute;
    width: 1px;
    height: 100%;
    background: #fff;
    left: 66%;
    top: 0;
`;

const LT = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: ${border}px;
    background: #fff;
    ::after {
        position: absolute;
        left: 0;
        top: 0;
        width: 4px;
        height: 20px;
        background: #fff;
        content: '';
    }
`;

const RT = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: ${border}px;
    background: #fff;
    ::after {
        position: absolute;
        right: 0;
        top: 0;
        width: 4px;
        height: 20px;
        background: #fff;
        content: '';
    }
`;

const LB = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 20px;
    height: ${border}px;
    background: #fff;
    ::after {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 4px;
        height: 20px;
        background: #fff;
        content: '';
    }
`;

const RB = styled.div`
    position: absolute;
    bottom: 0;
    right: 0;
    width: 20px;
    height: ${border}px;
    background: #fff;
    ::after {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 4px;
        height: 20px;
        background: #fff;
        content: '';
    }
`;

const MT = styled.div`
    position: absolute;
    top: 0;
    left: 50%;
    width: 20px;
    height: ${border}px;
    background: #fff;
    transform: translateX(-50%);
`;

const MB = styled.div`
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 20px;
    height: ${border}px;
    background: #fff;
    transform: translateX(-50%);
`;

const ML = styled.div`
    position: absolute;
    top: 50%;
    left: 0;
    height: 20px;
    width: ${border}px;
    background: #fff;
    transform: translateY(-50%);
`;

const MR = styled.div`
    position: absolute;
    top: 50%;
    right: 0;
    height: 20px;
    width: ${border}px;
    background: #fff;
    transform: translateY(-50%);
`;




const xMapValue = mapValue(-1, 1, 0, 1);
const yMapValue = mapValue(-1, 1, 1, 0);
export const ResizeBox: React.FC = () => {
    const {state, dispatch} = useContext(Context);
    console.log(state.currentLayer);
    let left = 0, right = 0, top = 0, bottom = 0;
    if (state.currentLayer) {
        left = xMapValue(state.currentLayer.originPosition.x1);
        right = xMapValue(state.currentLayer.originPosition.x2);
        top = yMapValue(state.currentLayer.originPosition.y2);
        bottom = yMapValue(state.currentLayer.originPosition.y1);
    }
    return (
        <Wrapper style={{
            left: `${left * 100}%`,
            right: `${(1 - right) * 100}%`,
            top: `${top * 100}%`,
            bottom: `${(1 - bottom) * 100}%`
        }}>
            <LT/>
            <RT/>
            <LB/>
            <RB/>
            <MT/>
            <MB/>
            <ML/>
            <MR/>
            <InnerWrapper>
                <H1/>
                <H2/>
                <V1/>
                <V2/>
            </InnerWrapper>
        </Wrapper>
    )
};