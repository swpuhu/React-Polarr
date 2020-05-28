import React from 'react';
import cs from 'classnames'

// require 一个目录/文件夹
require('../icons/clip.svg');
require('../icons/history.svg');
require('../icons/color.svg');
require('../icons/effect.svg');
require('../icons/filter.svg');
require('../icons/light.svg');
require('../icons/arrowLeft.svg');
require('../icons/arrowRight.svg');
type Props = {
    name?: string
} & React.SVGAttributes<SVGElement>
// name = money
// xlinkHref = "#money"
const Icon = (props: Props) => {
    const {name, children, className, ...rest} = props;
    return (
        <svg className={cs('icon', className)} {...rest}>
            {props.name && <use xlinkHref={'#' + props.name}/>}
        </svg>
    )
};

export {Icon};