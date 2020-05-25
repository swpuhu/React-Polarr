import React, {useContext, useEffect, useRef} from "react";
import styled from "styled-components";
import {useFile} from "../lib/useFile";
import {Context} from "../Context";
import {ActionType, EditStatus} from "../types/type";
import {Canvas} from "../render/Cavans";
// @ts-ignore
import StatisticColorWorker from '../lib/statisticColor.worker';
import {Histogram} from "../render/Histogram";

const worker = new StatisticColorWorker();
const Wrapper = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
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
    let data = e.data;
    histogramCanvas.draw(data[0], data[1], data[2]);
}
const canvas = Canvas(0, 0);
const histogramCanvas = Histogram(200, 200);
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
                if (canvas) {
                    let screenWidth = window.devicePixelRatio * window.innerWidth;
                    let screenHeight = window.devicePixelRatio * (window.innerHeight - 92);
                    let width = screenWidth, height = screenHeight;
                    if (image.width / image.height > screenWidth / screenHeight) {
                        // 宽适配
                        height = screenWidth / (image.width / image.height);
                        canvas.canvasElement.style.width = '100%';
                        canvas.canvasElement.style.height = window.innerWidth / (image.width / image.height) + 'px';
                    } else {
                        // 高适配
                        width = screenHeight * (image.width / image.height);
                        canvas.canvasElement.style.height = '100%';
                        canvas.canvasElement.style.width = (window.innerHeight - 92) * (image.width / image.height) + 'px';
                    }
                    canvas.viewport(width, height);
                }
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
                container.appendChild(histogramCanvas.canvasElement);
                let success = canvas.renderer.render(state.layers);
                if (success) {
                    console.log(canvas.canvasElement.width, canvas.canvasElement.height);
                    let data = new Uint8ClampedArray(canvas.canvasElement.width * canvas.canvasElement.height * 4);
                    canvas.gl.readPixels(0, 0, canvas.canvasElement.width, canvas.canvasElement.height, canvas.gl.RGBA, canvas.gl.UNSIGNED_BYTE, data);
                    worker.postMessage([data, histogramCanvas.canvasElement.height], [data.buffer]);
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