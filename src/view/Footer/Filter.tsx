import React, {useContext} from 'react';
import {Context} from "../../Context";
import {ActionType, FilterCategoryType, FilterSubType} from "../../types/type";
import styled from "styled-components";
import {FilterIndicator} from "../../components/FilterIndicator";
import {ControlSlider} from "../../components/ControlSlider";

const InnerWrapper = styled.div`
    //position: absolute;
    //width: 100%;
    //bottom: 0;
    white-space: nowrap;
    overflow: auto;
    background: #00000066;
`;

const OutterWrapper = styled.div`
    position: absolute;
    width: 100%;
    bottom: 0;
    background: #00000066;
    > .filter-indicator {
    }
`;
type IndicatorsType<T extends FilterCategoryType> = {
    type: T,
    children: {
        subType: FilterSubType<T>,
        intensity: number
    }[]
}
export const Filter:React.FC = (props) => {
    const {state, dispatch} = useContext(Context);
    const labelMap = {
        'normal': '原图',
        'flowerStone': '万花',
        'fluorite': '萤石',
        'fluoriteBlue': '萤-天空',
        'fluoriteVenus': '萤-维纳斯'
    };
    const indicators: IndicatorsType<FilterCategoryType>[] = [
        {
            type: 'vintage',
            children: [
                {
                    subType: 'flowerStone',
                    intensity: 100
                },
                {
                    subType: 'fluorite',
                    intensity: 100
                },
                {
                    subType: 'fluoriteBlue',
                    intensity: 100
                },
                {
                    subType: 'fluoriteVenus',
                    intensity: 100
                }
            ]
        }
    ];
    let showIndicator = indicators.find(item => state.currentLayer && item.type === state.currentLayer.filter.currentCategory);
    if (showIndicator) {
        showIndicator.children.unshift({
            subType: 'normal',
            intensity: 100
        })
    }
    console.log(state.currentLayer && state.currentLayer.filter.intensity);
    const changeIntensity = (value: number) => {
        dispatch({type: ActionType.updateFilterIntensity, payload: value})
    }
    return (
        <OutterWrapper>
            {state.currentLayer && state.currentLayer.filter.type !== 'normal'
                ? <ControlSlider onChange={changeIntensity} value={state.currentLayer ? state.currentLayer.filter.intensity : 0}
                                 min={0} max={100} step={1}
                                 className={'filter-indicator'}/>
                : null}
            <InnerWrapper>
                {showIndicator && showIndicator.children.map((item, index) => {
                    let isActive = state.currentLayer && state.currentLayer.filter.type === item.subType;
                    // let value = state.currentLayer ? state.currentLayer.filter.intensity : 0;
                    return <FilterIndicator key={item.subType ? item.subType : index} value={state.currentLayer ? state.currentLayer.filter.intensity : 0}                                            min={0}
                                            max={100}
                                            label={item.subType ? labelMap[item.subType] : 'a'}
                                            className={item.subType ? item.subType : ''}
                                            onClick={() => {
                                                dispatch({type: ActionType.updateFilterSubType, payload: item.subType});
                                            }}
                                            isActive={!!isActive}/>
                })}

            </InnerWrapper>
        </OutterWrapper>
    )
};