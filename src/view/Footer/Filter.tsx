import React, {useContext} from 'react';
import {Context} from "../../Context";
import {ActionType, Color, FilterCategoryType, FilterSubType, LutFilterType} from "../../types/type";
import styled from "styled-components";
import {ControlSlider} from "../../components/ControlSlider";
import {Indicator} from "../../components/Indicator";
import {FilterIndicator} from "../../components/FilterIndicator";

const Wrapper = styled.div`
    display: flex;
`;
const OuterWrapper = styled.div`
    position: absolute;
    width: 100%;
    bottom: 0;
    background: #00000066;
`;
type IndicatorsType<T extends FilterCategoryType> = {
    type: T,
    children: {
        subType: FilterSubType<T>
    }[]
}
export const Filter:React.FC = (props) => {
    const {state, dispatch} = useContext(Context);
    const labelMap = {
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
                },
                {
                    subType: 'fluorite'
                }
            ]
        }
    ];
    let showIndicator = indicators.find(item => state.currentLayer && item.type === state.currentLayer.filter.currentCategory);

    return (
        <OuterWrapper>
            {showIndicator && showIndicator.children.map((item, index) => {
                let isActive = state.currentLayer && state.currentLayer.filter.type === item.subType;
                item.subType && console.log(labelMap[item.subType]);
                return <FilterIndicator key={item.subType ? item.subType : index} value={0}
                                        min={0}
                                        max={100}
                                        label={item.subType ? labelMap[item.subType] : 'a'}
                                        className={item.subType ? item.subType : ''}
                                        isActive={!!isActive}/>
            })}

        </OuterWrapper>
    )
};