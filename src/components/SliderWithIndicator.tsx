import React, {useState} from 'react';
import { Indicator } from './Indicator';
import { ControlSlider } from './ControlSlider';

type Props = {
    value: number
    onChange: (number: number) => void
    label: string,
    min: number,
    max: number,
    step: number
}
export const SliderWithIndicator:React.FC<Props> = (props) => {
    const [showSlider, setShowSlider] = useState(false);
    const toggle = () => {
        setShowSlider(!showSlider);
    };
    return (
        <div>
            {
                showSlider ?
                <ControlSlider onChange={(value) => {
                    props.onChange(value);
                }} min={props.min} max={props.max} value={props.value} step={props.step}/> :
                null
            }
            {/*<Indicator onClick={toggle} className="temperature" value={props.value} min={props.min} max={props.max} label={props.label}/>*/}
        </div>
    )
};