import React, {useContext} from 'react';
import styled from "styled-components";
import {useFile} from "../lib/useFile";
import {ActionType} from "../types/type";
import {Context} from "../Context";
const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    background: #111;
`;

const Button = styled.div`
    min-width: 50px;
    padding: 10px;
`;

const Header: React.FC = (props) => {
    const {input} = useFile((file) => {
        // console.log(file);
    });
    const {dispatch} = useContext(Context);
    const open = () => {
        input.click();
    };
    const savePicture = () => {
        dispatch({type: ActionType.savePicture, payload: null});
    }
    return (
        <Wrapper>
            <Button onClick={open}>打开</Button>
            <Button onClick={savePicture}>保存</Button>
        </Wrapper>
    )
}

export {Header}