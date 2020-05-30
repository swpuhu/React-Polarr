import styled from "styled-components";

const border = 2;
export const Wrapper = styled.div`
    position: absolute;
`;
export const InnerWrapper = styled.div`
    position: absolute;
    left: ${border}px;
    right: ${border}px;
    top: ${border}px;
    bottom: ${border}px;
    border: 2px solid #ffffff;
`;
export const V1 = styled.div`
    position: absolute;
    height: 1px;
    width: 100%;
    background: #fff;
    top: 33%;
    left: 0;
`;
export const V2 = styled.div`
    position: absolute;
    height: 1px;
    width: 100%;
    background: #fff;
    top: 66%;
    left: 0;
`;

export const H1 = styled.div`
    position: absolute;
    width: 1px;
    height: 100%;
    background: #fff;
    left: 33%;
    top: 0;

`;

export const H2 = styled.div`
    position: absolute;
    width: 1px;
    height: 100%;
    background: #fff;
    left: 66%;
    top: 0;
`;

export const LT = styled.div`
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

export const RT = styled.div`
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

export const LB = styled.div`
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

export const RB = styled.div`
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

export const MT = styled.div`
    position: absolute;
    top: 0;
    left: 50%;
    width: 20px;
    height: ${border}px;
    background: #fff;
    transform: translateX(-50%);
`;

export const MB = styled.div`
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 20px;
    height: ${border}px;
    background: #fff;
    transform: translateX(-50%);
`;

export const ML = styled.div`
    position: absolute;
    top: 50%;
    left: 0;
    height: 20px;
    width: ${border}px;
    background: #fff;
    transform: translateY(-50%);
`;

export const MR = styled.div`
    position: absolute;
    top: 50%;
    right: 0;
    height: 20px;
    width: ${border}px;
    background: #fff;
    transform: translateY(-50%);
`;