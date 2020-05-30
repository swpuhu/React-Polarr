import React, {useContext, useEffect, useRef} from 'react';
import {Context} from "../../Context";
import {mapValue} from "../../render/GLUtil";
import {H1, H2, InnerWrapper, LB, LT, MB, ML, MR, MT, RB, RT, V1, V2, Wrapper} from "./ResizeBoxStyle";
import {switchHandler} from "../../lib/util";
import {ActionType, Position, Transform} from "../../types/type";


const xMapValue = mapValue(-1, 1, 0, 1);
const yMapValue = mapValue(-1, 1, 1, 0);
type HandlerType = (container: HTMLElement, initLeft: number, initTop: number, initWidth: number, initHeight: number, offsetX: number, offsetY: number) => void;
export const ResizeBox: React.FC = () => {
    const {state, dispatch} = useContext(Context);
    const container = useRef<HTMLDivElement>(null);


    const nw = (container: HTMLElement, initLeft: number, initTop: number, initWidth: number, initHeight: number, offsetX: number, offsetY: number) => {
        container.style.left = initLeft + offsetX + 'px';
        container.style.width = initWidth - offsetX + 'px';
        container.style.top = initTop + offsetY + 'px';
        container.style.height = initHeight - offsetY + 'px';
    };
    const n = (container: HTMLElement, initLeft: number, initTop: number, initWidth: number, initHeight: number, offsetX: number, offsetY: number) => {
        container.style.top = initTop + offsetY + 'px';
        container.style.height = initHeight - offsetY + 'px';
    };
    const ne = (container: HTMLElement, initLeft: number, initTop: number, initWidth: number, initHeight: number, offsetX: number, offsetY: number) => {
        container.style.width = initWidth + offsetX + 'px';
        container.style.top = initTop + offsetY + 'px';
        container.style.height = initHeight - offsetY + 'px';
    };
    const w = (container: HTMLElement, initLeft: number, initTop: number, initWidth: number, initHeight: number, offsetX: number, offsetY: number) => {
        container.style.left = initLeft + offsetX + 'px';
        container.style.width = initWidth - offsetX + 'px';
    };
    const drag = (container: HTMLElement, initLeft: number, initTop: number, initWidth: number, initHeight: number, offsetX: number, offsetY: number) => {
        container.style.left = initLeft + offsetX + 'px';
        container.style.top = initTop + offsetY + 'px';
        // container.style.width = initWidth + offsetX + 'px';
        // container.style.height = initHeight + offsetY + 'px';
    };

    const e = (container: HTMLElement, initLeft: number, initTop: number, initWidth: number, initHeight: number, offsetX: number, offsetY: number) => {
        container.style.width = initWidth + offsetX + 'px';
    };

    const sw = (container: HTMLElement, initLeft: number, initTop: number, initWidth: number, initHeight: number, offsetX: number, offsetY: number) => {
        container.style.left = initLeft + offsetX + 'px';
        container.style.width = initWidth - offsetX + 'px';
        container.style.height = initHeight + offsetY + 'px';
    };

    const s = (container: HTMLElement, initLeft: number, initTop: number, initWidth: number, initHeight: number, offsetX: number, offsetY: number) => {
        container.style.height = initHeight + offsetY + 'px';
    };

    const se = (container: HTMLElement, initLeft: number, initTop: number, initWidth: number, initHeight: number, offsetX: number, offsetY: number) => {
        container.style.width = initWidth + offsetX + 'px';
        container.style.height = initHeight + offsetY + 'px';
    };
    const handlers: HandlerType[] = [nw, n, ne, w, drag, e, sw, s, se];
    let currentHandler: HandlerType | null = null;
    let leftBoundary, rightBoundary, topBoundary, bottomBoundary;
    const touchStart = function (this: HTMLElement, e: TouchEvent) {
        e.preventDefault();
        if (!container.current) return;
        leftBoundary = container.current.offsetLeft;
        rightBoundary = leftBoundary + container.current.offsetWidth;
        topBoundary = container.current.offsetTop;
        bottomBoundary = topBoundary + container.current.offsetHeight;
        let initLeft = container.current.offsetLeft;
        let initWidth = container.current.offsetWidth;
        let initTop = container.current.offsetTop;
        let initHeight = container.current.offsetHeight;
        let height = bottomBoundary - topBoundary;
        let width = rightBoundary - leftBoundary; 
        let relativeX = e.touches[0].clientX - this.offsetLeft;
        let relativeY = e.touches[0].clientY - this.offsetTop;
        currentHandler = switchHandler<HandlerType>(leftBoundary, rightBoundary, topBoundary, bottomBoundary, relativeX, relativeY, handlers);
        if (currentHandler) {
            console.log(currentHandler.name);
        }
        const touchMove = (ev: TouchEvent) => {
            ev.preventDefault();
            let offsetX = ev.touches[0].clientX - e.touches[0].clientX;
            let offsetY = ev.touches[0].clientY - e.touches[0].clientY;
            if (currentHandler && container.current) {
                currentHandler(container.current, initLeft, initTop, initWidth, initHeight, offsetX, offsetY);
            }
        };
        const touchEnd = (e: TouchEvent) => {

            document.removeEventListener('touchmove', touchMove);
            document.removeEventListener('touchend', touchEnd);
        };
        document.addEventListener('touchmove', touchMove, {passive: false});
        document.addEventListener('touchend', touchEnd);

    };
    useEffect(() => {
        let canvas = document.getElementById('canvas');
        if (canvas && canvas.parentElement) {
            canvas.parentElement.addEventListener('touchstart', touchStart);
        }
        return () => {
            if (canvas && canvas.parentElement) {
                canvas.parentElement.removeEventListener('touchstart', touchStart);
            }
        }
    }, []);
    let left = 0, right = 0, top = 0, bottom = 0;
    if (state.currentLayer) {
        left = xMapValue(state.currentLayer.originPosition.x1);
        right = xMapValue(state.currentLayer.originPosition.x2);
        top = yMapValue(state.currentLayer.originPosition.y2);
        bottom = yMapValue(state.currentLayer.originPosition.y1);
    }
    return (
        <Wrapper ref={container} style={{
            left: `${left * 100}%`,
            width: `${(right - left) * 100}%`,
            top: `${top * 100}%`,
            height: `${(bottom - top) * 100}%`
        }}>
            <LT/>
            <RT/>
            <LB/>
            <RB/>
            <MT/>
            <MB/>
            <ML/>
            <MR/>
            <InnerWrapper>
                <H1/>
                <H2/>
                <V1/>
                <V2/>
            </InnerWrapper>
        </Wrapper>
    )
};