import React, {useContext} from 'react';
import {Context} from "../../Context";
import styled from "styled-components";
import {ActionType} from "../../types/type";

const Wrapper = styled.div`
        position: absolute;
        bottom: 0;
        width: 100px;
        background: rgba(255, 255, 255, 0.5);
        text-align: center;
        border-radius: 5px;
        .item {
            padding: 3px 0;
        }
`;

export const HistoryList: React.FC = (props) => {
    const {state: states, dispatch} = useContext(Context);
    const backTrack = (index: number) => {
        dispatch({type: ActionType.backTrackHistory, payload: index});
    };
    return (
        <Wrapper>
            {states.map((state, index) => state.historyType ?
                <div className="item" key={index} onClick={() => backTrack(index)}>{state.historyType}</div>
                : null)}
        </Wrapper>
    )
}