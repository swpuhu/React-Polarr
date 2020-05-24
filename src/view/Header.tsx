import React from 'react';
import styled from "styled-components";
import {useFile} from "../lib/useFile";
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
        console.log(file);
    });
    const open = () => {
        input.click();
    };
    return (
        <Wrapper>
            <Button onClick={open}>打开</Button>
            <Button>保存</Button>
        </Wrapper>
    )
}

export {Header}