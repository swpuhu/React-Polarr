import React, {useContext, useEffect, useRef} from "react";
import styled from "styled-components";
import {useFile} from "../lib/useFile";
import {Context} from "../Context";
import {ActionType, EditStatus} from "../types/type";
import {WebGL} from "../render/WebGL";

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
const Center = styled.div`
    width: 100%;
    height: 100%;
    text-align: center;
`;

const Main: React.FC = () => {
    const {state, dispatch} = useContext(Context);
    const {input} = useFile((file) => {
        if (/\.png$/.test(file.name) || /\.jpe?g$/.test(file.name) || /\.bmp$/.test(file.name)) {
            let image = document.createElement('img');
            let url = URL.createObjectURL(file);
            image.onload = () => {
                dispatch({type: ActionType.addLayer, payload: {source: image, position: [0.0, 0.0, 1.0, 1.0]}});
                URL.revokeObjectURL(url);
            };
            image.src = url;
        }
    });

    const open = () => {
        input.click();
    };
    const canvas = useRef(document.createElement('canvas'));
    useEffect(() => {
        console.log(canvas.current);
        if (canvas.current !== null) {
            let canvasEle = canvas.current;
            if (canvasEle) {
                canvasEle.width = 2 * window.innerWidth;
                canvasEle.height = 2 * (window.innerHeight - 89);
                let gl = canvasEle.getContext('webgl', {
                    premultipliedAlpha: false,
                    antialias: true
                });
                if (gl) {
                    let renderer = WebGL(gl);
                    renderer.render(state.layers);
                }
            }

        }
    });
    const buttons = (
        <div>
            <Button onClick={open}>打开照片</Button>
            <Button>打开样本照片</Button>
        </div>
    );
    const reactCanvas = (
        <Center>
            <canvas style={{width: "100%", height: "100%"}} ref={canvas}/>
        </Center>
    );
    const content = state.editStatus === EditStatus.IDLE ? buttons : reactCanvas;
    return (
        <Wrapper>
            {content}
        </Wrapper>
    )
};

export {Main}