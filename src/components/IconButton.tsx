import React from "react";
import styled from "styled-components";
import {Icon} from "./Icon";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    .icon {
        width: 30px;
        height: 30px;
        fill: #b4b3af;
        margin-bottom: 5px;
        &.active {
            fill: #fff;
        }
    }
`;
type Props = {
    label: string,
    iconName: string,
    isActive: boolean
}
const IconButton: React.FC<Props> = (props) => {
    return (
        <Wrapper>
            <Icon name={props.iconName} className={props.isActive ? 'active' : ''}/>
            <div>{props.label}</div>
        </Wrapper>
    )
};

export {IconButton};