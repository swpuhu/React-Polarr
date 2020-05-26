import React, {useContext} from 'react';
import {Context} from "../Context";
import styled from "styled-components";

const Wrapper = styled.div`
    position: absolute;
`;
export const ResizeBox: React.FC = () => {
    const {state, dispatch} = useContext(Context);
    return (
        <Wrapper style={{
        }}>
        </Wrapper>
    )
};