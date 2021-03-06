import React, {useContext, useState} from 'react';
import {IconButton} from "../../components/IconButton";
import styled from "styled-components";
import {Context} from "../../Context";
import {ActionType, EditStatus, EditType} from "../../types/type";
import {ColorFilter} from "./ColorFilter";
import {EffectFilter} from "./Effect";
import {Filter} from "./Filter";
import {HistoryList} from './HistoryList';
import {getLastState} from "../../lib/util";
import {LightFilter} from "./LightFilter";

const Wrapper = styled.div`
    > .footer-icon {
        display: flex;
        justify-content: space-between;
        background: #111;
    }
`;

const Footer: React.FC = () => {
    const {state: states, dispatch} = useContext(Context);
    const layer = getLastState(states.historyLayers);
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
        if (states.editStatus !== EditStatus.EDTING) return;
        if (id === 2) {
            if (states.transformStatus === EditType.transform) {
                dispatch({type: ActionType.finishClipPath, payload: null});
            } else {
                dispatch({type: ActionType.startClipPath, payload: null});
            }
        } else {
            dispatch({type: ActionType.finishClipPath, payload: null});
        }
        let selectedItem = buttons.find(item => item.selected);
        let button = buttons.map(item => {
            item.selected = item.id === id;
            return item;
        });
        if (selectedItem && selectedItem.id === id) {
            setButtons(initButtons);
        } else {
            setButtons(button);
        }
    };
    const activeButton = buttons.find(item => item.selected);
    let showController = null;
    if (activeButton) {
        switch (activeButton.id) {
            case 1:
                showController = <HistoryList/>;
                break;
            case 2:
                break;
            case 3:
                showController = <Filter/>;
                break;
            case 4:
                showController = <LightFilter/>;
                break;
            case 5:
                showController = <ColorFilter/>;
                break;
            case 6:
                showController = <EffectFilter/>;
                break;
            default:
                break;
        }
    }
    return (

        <Wrapper>
            <div style={{position: 'relative'}}>
                {showController}
            </div>
            <div className="footer-icon">
                {buttons.map(button => <IconButton onClick={() => onClick(button.id)}
                                                   key={button.id}
                                                   label={button.label}
                                                   iconName={button.iconName}
                                                   isActive={states.editStatus === EditStatus.EDTING}
                                                   isSelected={button.selected}/>)}
            </div>
        </Wrapper>
    )
};

export {Footer}