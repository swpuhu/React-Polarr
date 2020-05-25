import React, {useContext, useEffect, useRef} from "react";
import styled from "styled-components";
import {useFile} from "../lib/useFile";
import {Context} from "../Context";
import {ActionType, EditStatus} from "../types/type";
import {Canvas} from "../render/Cavans";
// @ts-ignore
import StatisticColorWorker from '../lib/statisticColor.worker';

const worker = new StatisticColorWorker();
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
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
worker.onmessage = (e: any) => {
    console.log(e.data);
}
const canvas = Canvas(0, 0);
const Main: React.FC = () => {
    const {state, dispatch} = useContext(Context);
    const {input} = useFile((file) => {
        if (/\.png$/.test(file.name) || /\.jpe?g$/.test(file.name) || /\.bmp$/.test(file.name)) {
            let image = document.createElement('img');
            let url = URL.createObjectURL(file);
            image.onload = () => {
                dispatch({type: ActionType.addLayer, payload: {source: image, position: [0.0, 0.0, 1.0, 1.0]}});
                dispatch({type: ActionType.updateCanvasSize, payload: {width: image.width, height: image.height}});
                URL.revokeObjectURL(url);
            };
            image.src = url;
        }
    });

    const open = () => {
        input.click();
    };
    const canvasContainer = useRef(document.createElement('div'));
    useEffect(() => {
        if (canvasContainer.current !== null) {
            let container = canvasContainer.current;
            if (canvas && container) {
                container.appendChild(canvas.canvasElement);
                let width = window.devicePixelRatio * window.innerWidth;
                let height = window.devicePixelRatio * (window.innerHeight - 92);
                if (state.width / state.height > width / height) {
                    // 宽适配
                    canvas.canvasElement.style.width = '100%';
                    canvas.canvasElement.style.height = 100 / (state.width / state.height) + '%';
                    height = width / (state.width / state.height);
                } else {
                    // 高适配
                    canvas.canvasElement.style.height = '100%';
                    canvas.canvasElement.style.width = 100 * (state.width / state.height) + '%';
                    width = height * (state.width / state.height);
                }
                canvas.viewport(width, height);
                canvas.renderer.render(state.layers);
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
        <Center ref={canvasContainer}>
            {/*<canvas style={{width: "100%", height: "100%"}} ref={canvas}/>*/}
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