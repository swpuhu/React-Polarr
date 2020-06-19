import React, {useContext, useEffect, useRef, useState} from 'react';
import styled from "styled-components";
import {Icon} from "./Icon";
import {clamp, throttle} from "../lib/util";
import {roundNumber} from "../render/GLUtil";
import {Context} from "../Context";
import {ActionType} from "../types/type";

const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;
    > .slider-bar {
        flex: 1;
        position: relative;
        margin: 0 10px;
    }
    > .slider-button {
        width: 30px;
        height: 30px;
        fill: #fff;
    }
`;

const Bar = styled.div`
    height: 4px;
    background: #fff;
    border-radius: 2px;
`;


const Point = styled.div`    
    width: 30px;
    height: 30px;
    background: #f60;
    border-radius: 50%;
    border: 2px solid #fff;
    position: absolute;
    top: 50%;
    transform: translate(-10px, -50%);
    touch-action: none;
`;

type Props = {
    onChange: (value: number) => void;
    value: number
    min: number
    max: number
    step: number,
    className: string
}
export const ControlSlider:React.FC<Props> = (props) => {
    const pointRef = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const range = props.max - props.min;
    // const value = props.value;
    const [value, _setValue] = useState(props.value);
    const {dispatch} = useContext(Context);
    const onChange = throttle(props.onChange, 30);
    const setValue = (v: number) => {
        _setValue(v);
        onChange(v);
    };
    const touchStart = (e: React.TouchEvent) => {
        e.persist();
        let bar = barRef.current;
        dispatch({type: ActionType.addHistory, payload: null});
        const touchmove = (ev: TouchEvent) => {
            ev.preventDefault();
            if (bar) {
                let _value = roundNumber(value + (ev.touches[0].clientX - e.touches[0].clientX) / bar.offsetWidth * range, props.step);
                _value = clamp(_value, props.min, props.max);
                setValue(_value);
            }
        };
        const touchend = () => {
            document.removeEventListener('touchmove', touchmove);
            document.removeEventListener('touchend', touchend);
        };
        document.addEventListener('touchmove', touchmove);
        document.addEventListener('touchend', touchend);
    };

    let id: number;
    let count = 1;
    let first = true;
    const add = () => {
        if (first) {
            first = false;
            id = setTimeout(add, 300);
        } else {
            id = setTimeout(add, 50);
        }

        setValue(clamp(value + count * props.step, props.min, props.max));
        count++;
    };

    const sub = () => {
        if (first) {
            first = false;
            id = setTimeout(sub, 300);
        } else {
            id = setTimeout(sub, 50);
        }
        setValue(clamp(value - count * props.step, props.min, props.max));
        count++;
    };
    useEffect(() => {
        const touchEnd = () => {
            first = true;
            clearTimeout(id);
        };
        document.addEventListener('touchend', touchEnd);
    });


    return (
        <Wrapper className={props.className}>
            <Icon name="arrowLeft" className="slider-button" onTouchStart={sub}/>
            <div className="slider-bar">
                <Bar ref={barRef}/>
                {/*<Shadowbar ref={shadowbarRef} style={{*/}
                {/*    width: `${(value - props.min) / (props.max - props.min) * 100}%`*/}
                {/*}}/>*/}
                <Point ref={pointRef} onTouchStart={touchStart} style={{
                    left: `${(value - props.min) / (props.max - props.min) * 100}%`
                }}/>
            </div>
            <Icon name="arrowRight" className="slider-button" onTouchStart={add}/>
        </Wrapper>
    )
};