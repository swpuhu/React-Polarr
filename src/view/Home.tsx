import React from 'react';
import styled from "styled-components";
import { Header } from './Header';
import {Footer} from "./Footer";
import {Main} from "./Main";
const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    background: #000;
`

const Home: React.FC = (props) => {
    return (
        <Wrapper>
            <Header/>
            <Main/>
            <Footer/>
        </Wrapper>
    )
}

export {Home};