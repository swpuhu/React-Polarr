import React, {useContext, useState} from 'react';
import {IconButton} from "../../components/IconButton";
import styled from "styled-components";
import {Context} from "../../Context";
import {EditStatus} from "../../types/type";
import {ColorFilter} from "./ColorFilter";

const Wrapper = styled.div`
    > .footer-icon {
        display: flex;
        justify-content: space-between;
        background: #111;
    }
`;

const Footer: React.FC = () => {
    const {state} = useContext(Context);
    const initButtons = [
        {
            id: 1,
            label: '历史记录',
            selected: false,
            iconName: 'history'
        },
        {
            id: 2,
            label: '裁剪',
            selected: false,
            iconName: 'clip'
        },
        {
            id: 3,
            label: '滤镜',
            selected: false,
            iconName: 'filter'
        },
        {
            id: 4,
            label: '光效',
            selected: false,
            iconName: 'light'
        },
        {
            id: 5,
            label: '色彩',
            selected: false,
            iconName: 'color'
        },
        {
            id: 6,
            label: '特效',
            selected: false,
            iconName: 'effect'
        }
    ];
    const [buttons, setButtons] = useState(initButtons);

    const onClick = (id: number) => {
        if (state.editStatus !== EditStatus.EDTING) return;
        let button = buttons.map(item => {
            item.selected = item.id === id;
            return item;
        });
        setButtons(button);
    };
    const activeButton = buttons.find(item => item.selected);
    return (

        <Wrapper>
            <div style={{position: 'relative'}}>
                {
                    activeButton && activeButton.id === 5 ? <ColorFilter/> : null
                }
            </div>
            <div className="footer-icon">

                {buttons.map(button => <IconButton onClick={() => onClick(button.id)}
                                                   key={button.id}
                                                   label={button.label}
                                                   iconName={button.iconName}
                                                   isActive={state.editStatus === EditStatus.EDTING}
                                                   isSelected={button.selected}/>)}
            </div>
        </Wrapper>
    )
};

export {Footer}