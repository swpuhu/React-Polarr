import React from 'react';
import {Indicator} from "../../components/Indicator";
import {Slider} from "../../components/Slider";

export const Color:React.FC = (props) => {
    return (
        <div>
            <Slider onChange={(value) => {
            }} min={0} max={100} value={20} step={1}/>
            <Indicator className="temperature" value={0} min={-100} max={100} label="色温"/>
        </div>
    )
};