import React, {useContext} from 'react';
import {Context} from "../../Context";
import styled from "styled-components";
import {ActionType} from "../../types/type";

const Wrapper = styled.div`
        position: absolute;
        bottom: 0;
        width: 100px;
        max-height: 150px;
        overflow-x: hidden;
        overflow-y: auto;
        background: rgba(0, 0, 0, 0.5);
        text-align: center;
        border-radius: 5px;
        .item {
            padding: 5px 0;
            &.disappear {
                color: #8d8d8d;
            }
        }
`;

export const HistoryList: React.FC = (props) => {
    const {state: states, dispatch} = useContext(Context);
    const backTrack = (index: number) => {
        dispatch({type: ActionType.backTrackHistory, payload: index});
    };
    return (
        <Wrapper>
            {states.historyLayers.slice().reverse().map((state, index) => state.historyType ?
                <div className={"item" + (state.trackable ? '' : ' disappear')}
                     key={index} 
                     onClick={() => backTrack(states.historyLayers.length - index - 1)}>{state.historyType}</div>
                : null)}
        </Wrapper>
    )
}