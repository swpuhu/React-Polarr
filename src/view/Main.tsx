import React, {useContext, useEffect, useRef} from "react";
import styled from "styled-components";
import {useFile} from "../lib/useFile";
import {Context} from "../Context";
import {ActionType, EditStatus, EditType, Layer, MyCanvas} from "../types/type";
import {Canvas} from "../render/Canvas";
// @ts-ignore
import StatisticColorWorker from '../lib/statisticColor.worker';
import {Histogram} from "../render/Histogram";
import {debounce, getLastState, isDetachedDOM, saveCanvasPicture} from "../lib/util";
import {ResizeBox} from "../components/ResizeBox/ResizeBox";
import {Modal} from "../components/Modal";

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
    position: relative;
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
};
const histogramCanvas = Histogram(360, 150);
const canvas = Canvas(window.devicePixelRatio * window.innerWidth, window.devicePixelRatio * (window.innerHeight - 92));
const offCanvas = Canvas(300, 200, true);
const analyzeImage = debounce((canvas: MyCanvas, layer: Layer) => {
    if (canvas) {
        let [x1, y1, x2, y2] = canvas.renderer.render(layer);
        let data = new Uint8ClampedArray((x2 - x1) * (y2 - y1) * 4);
        canvas.gl.readPixels(x1, y1, x2 - x1, y2 - y1, canvas.gl.RGBA, canvas.gl.UNSIGNED_BYTE, data);
        worker.postMessage([data, histogramCanvas.canvasElement.height], [data.buffer]);
    }
}, 100);


const Main: React.FC = () => {
    const {state: states, dispatch} = useContext(Context);
    const state = getLastState(states);
    console.log(states);
    const {input} = useFile((file) => {
    });

    const open = () => {
        input.click();
    };
    const canvasContainer = useRef(document.createElement('div'));
    useEffect(() => {
        if (canvasContainer.current !== null) {
            let container = canvasContainer.current;
            if (canvas && container) {
                if (isDetachedDOM(canvas.canvasElement)) {
                    container.appendChild(canvas.canvasElement);
                    container.appendChild(histogramCanvas.canvasElement);
                }
                let [x1] = canvas.renderer.render(state.currentLayer);
                analyzeImage(canvas, state.currentLayer);
                if (x1 !== undefined) {
                    if (state.savePicture && offCanvas) {
                        if (offCanvas.canvasElement.width !== state.width || offCanvas.canvasElement.height !== state.height) {
                            state.currentLayer && state.currentLayer.source && offCanvas.viewport(state.currentLayer.source.width, state.currentLayer.source.height);
                        }
                        offCanvas.renderer.render(state.currentLayer);
                        saveCanvasPicture(offCanvas.canvasElement, '保存图片.jpeg').then(r => dispatch({type: ActionType.finishSavePicture, payload: null}))

                    }
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

    const touchStart = (e: React.TouchEvent) => {
        if (canvas && state.currentLayer && state.currentLayer.editStatus !== EditType.transform) {
            canvas.renderer.render(state.currentLayer, true);
        }
    };
    const touchEnd = () => {
        if (canvas) {
            canvas.renderer.render(state.currentLayer);
        }
    };
    if (!state) debugger;
    const reactCanvas = (
            <Center ref={canvasContainer} onTouchStart={touchStart} onTouchEnd={touchEnd}>
            {state.currentLayer && state.currentLayer.editStatus === EditType.transform ?
                (
                    <div>
                        <ResizeBox/>
                        <div className="mask"/>
                    </div>
                )
                : null
            }

        </Center>
    );
    const content = state.editStatus === EditStatus.IDLE ? buttons : reactCanvas;
    return (
        <Wrapper onClick={(e) => {
            e.stopPropagation();
            if (state.editStatus === EditStatus.EDTING) {
                dispatch({type: ActionType.updateShowAllFilter, payload: false});
            }
        }}>
            {content}
            {state.openStatus ?
                <Modal>
                    <div>图片加载中</div>
                </Modal> : null}
        </Wrapper>
    )
};

export {Main}