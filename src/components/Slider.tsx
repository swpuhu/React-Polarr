import React, {useEffect, useRef} from 'react';
import styled from "styled-components";
import {Icon} from "./Icon";
import {dragable} from "../lib/util";
import {roundNumber} from "../render/GLUtil";

const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    > .slider-bar {
        flex: 1;
        position: relative;
        margin: 0 10px;
    }
    > .slider-button {
        width: 20px;
        height: 20px;
        fill: #fff;
    }
`;

const Bar = styled.div`
    height: 4px;
    background: #fff;
    border-radius: 2px;
`;


const Shadowbar = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 4px;
    background: #f60;
    border-radius: 2px;
`;

const Point = styled.div`    
    width: 20px;
    height: 20px;
    background: #f60;
    border-radius: 50%;
    border: 2px solid #fff;
    position: absolute;
    top: 50%;
    transform: translate(-10px, -50%);
`;

type Props = {
    onChange: (value: number) => void;
    value: number
    min: number
    max: number
    step: number
}
export const Slider:React.FC<Props> = (props) => {
    const point = useRef<HTMLDivElement>(null);
    const bar = useRef<HTMLDivElement>(null);
    const shadowbar = useRef<HTMLDivElement>(null);
    const range = props.max - props.min;
    useEffect(()=> {
        if (point.current && bar.current && shadowbar.current) {
            let element = point.current;
            let barElement = bar.current;
            let shadowbarElement = shadowbar.current;
            let offsetX = ~~((props.value / range) * barElement.offsetWidth);
            element.style.left = offsetX + 'px';
            shadowbarElement.style.width = offsetX + 'px';
            const mousemove = (offsetX: number, offsetY: number) => {
                shadowbarElement.style.width = offsetX + 'px';
                let value = roundNumber((offsetX / barElement.offsetWidth) * range, props.step);
                props.onChange(value);
            };
            let events = dragable(element, undefined, mousemove, undefined, true, false, 0, barElement.offsetWidth);
            return () => {
                element.removeEventListener('mousedown', events['mousedown']);
                element.removeEventListener('touchstart', events['touchstart']);
            }
        }
    }, []);
    return (
        <Wrapper>
            <Icon name="arrowLeft" className="slider-button"/>
            <div className="slider-bar">
                <Bar ref={bar}/>
                <Shadowbar ref={shadowbar}/>
                <Point ref={point}/>
            </div>
            <Icon name="arrowRight" className="slider-button"/>
        </Wrapper>
    )
};