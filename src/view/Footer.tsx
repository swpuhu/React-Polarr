import React, {useContext} from 'react';
import {IconButton} from "../components/IconButton";
import styled from "styled-components";
import {Context} from "../Context";
import {EditStatus} from "../types/type";

const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    background: #111;
`;

const Footer: React.FC = () => {
    const {state} = useContext(Context);
    return (
        <Wrapper>
            <IconButton label="历史记录" isActive={state.editStatus === EditStatus.EDTING} iconName={"history"}/>
            <IconButton label="裁剪" isActive={state.editStatus === EditStatus.EDTING} iconName={"clip"}/>
            <IconButton label="滤镜" isActive={state.editStatus === EditStatus.EDTING} iconName={"filter"}/>
            <IconButton label="光效" isActive={state.editStatus === EditStatus.EDTING} iconName={"light"}/>
            <IconButton label="色彩" isActive={state.editStatus === EditStatus.EDTING} iconName={"color"}/>
            <IconButton label="特效" isActive={state.editStatus === EditStatus.EDTING} iconName={"effect"}/>
        </Wrapper>
    )
};

export {Footer}