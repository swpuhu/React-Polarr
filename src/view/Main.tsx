import React, {useEffect, useRef} from "react";
import styled from "styled-components";
import {useFile} from "../lib/useFile";

const Wrapper = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const Button = styled.button`
    //min-width: 100px;
    display: block;
    padding: 10px;
    margin: 20px auto;
    border-radius: 10px;
    background: #333;
`;

const Main: React.FC = (props) => {
    const {input} = useFile((file) => {
        console.log(file);
    });
    const open = () => {
        input.click();
    };
    const canvas = useRef(document.createElement('canvas'));
    useEffect(() => {
        if (canvas.current !== null) {
            let canvasEle = canvas.current;
            if (canvasEle) {
                canvasEle.width = 500;
                canvasEle.height = 500;
                canvasEle.getContext('webgl');
            }

        }
    }, []);

    return (
        <Wrapper>
            <div>
                <Button onClick={open}>打开照片</Button>
                <Button>打开样本照片</Button>
            </div>
            <div>
                <canvas ref={canvas}/>
            </div>
        </Wrapper>
    )
}

export {Main}