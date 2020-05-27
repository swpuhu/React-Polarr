import React from 'react';
import {Indicator} from "../../components/Indicator";

export const Color:React.FC = (props) => {
    return (
        <div>
            <Indicator className="temperature" value={0} min={-100} max={100} label="色温"/>
        </div>
    )
};