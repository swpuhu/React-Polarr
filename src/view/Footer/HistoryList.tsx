import React, {useContext} from 'react';
import {Context} from "../../Context";
import styled from "styled-components";

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
    return (
        <Wrapper>
            {states.map(state => state.historyType ?
                <div className="item">{state.historyType}</div>
                : null)}
        </Wrapper>
    )
}