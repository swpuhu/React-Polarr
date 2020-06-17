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
`;

const OutterWrapper = styled.div`
    position: absolute;
    width: 100%;
    bottom: 0;
    background: rgba(60, 60, 60, 0.5);
    > .flex {
        display: flex;
        background: rgba(0, 0, 0, 0.4);
        > .all-filter {
            flex: 0 0 70px;
            line-height: 70px;
            margin: 5px;
            border: 1px solid #fff;
            border-radius: 5px;
        }
    }
`;
type IndicatorsType = {
    type: FilterCategoryType,
    children: {
        subType: FilterSubType<FilterCategoryType>,
    }[]
}
export const Filter:React.FC = (props) => {
    const {state, dispatch} = useContext(Context);
    const labelMap = {
        'normal': '原图',
        'flowerStone': '万花石',
        'fluorite': '萤石',
        'fluoriteBlue': '萤石-天空',
        'fluoriteVenus': '萤石-维纳斯',
        'fuchsite': '铬云母',
        'talc': '滑石',
        'tanzanite': '坦桑石',
        'tektite': '曜石',
        'thulite': '锰帘石',
        'baryte': '重晶石',
        'benitoite': '蓝锥石',
        'beryl': '绿柱石',
        'obsidian': '黑曜石',
        'okenite': '硅酸石',
        'oligoclase': '奥长石',
        'onyx': '黑玛瑙',
        'opal': '猫眼石',
        'opalite': '蛋白石',
        'orpiment': '雌黄',
        'pearl': '珍珠',
        'peridot': '橄榄石',
        'petalite': '锂长石',

    };
    const indicators: IndicatorsType[] = [
        {
            type: 'vintage',
            children: [
                {
                    subType: 'flowerStone',
                },
                {
                    subType: 'fluorite',
                },
                {
                    subType: 'fluoriteBlue',
                },
                {
                    subType: 'fluoriteVenus',
                },
                {
                    subType: 'fuchsite'
                },
                {
                    subType: 'talc'
                },
                {
                    subType: 'tanzanite'
                },
                {
                    subType: 'tektite'
                },
                {
                    subType: 'thulite'
                }
            ]
        },
        {
            type: 'cinema',
            children: [
                {
                    subType: 'obsidian',
                },
                {
                    subType: 'okenite',
                },
                {
                    subType: 'oligoclase',
                },
                {
                    subType: 'onyx',
                },
                {
                    subType: 'opal',
                },
                {
                    subType: 'opalite',
                },
                {
                    subType: 'orpiment',
                },
                {
                    subType: 'pearl',
                },
                {
                    subType: 'peridot',
                },
                {
                    subType: 'petalite',
                },
            ]
        }
    ];
    let showIndicator = indicators.find(item => state.currentLayer && item.type === state.currentLayer.filter.currentCategory);
    if (showIndicator) {
        showIndicator.children.unshift({
            subType: 'normal',
        })
    }
    const changeIntensity = (value: number) => {
        dispatch({type: ActionType.updateFilterIntensity, payload: value})
    };
    return (
        <OutterWrapper>
            {state.currentLayer && state.currentLayer.filter.type !== 'normal'
                ? <ControlSlider onChange={changeIntensity} value={state.currentLayer ? state.currentLayer.filter.intensity : 0}
                                 min={0} max={100} step={1}
                                 className={'filter-indicator'}/>
                : null}
            <div className="flex">
                <div className="all-filter">所有滤镜</div>
                <InnerWrapper>
                    {showIndicator && showIndicator.children.map((item, index) => {
                        let isActive = state.currentLayer && state.currentLayer.filter.type === item.subType;
                        // let value = state.currentLayer ? state.currentLayer.filter.intensity : 0;
                        return <FilterIndicator key={item.subType ? item.subType : index} value={state.currentLayer ? state.currentLayer.filter.intensity : 0}                                            min={0}
                                                max={100}
                                                label={item.subType ? labelMap[item.subType] : ''}
                                                className={item.subType ? item.subType : ''}
                                                onClick={() => {
                                                    dispatch({type: ActionType.updateFilterSubType, payload: item.subType});
                                                }}
                                                background={item.subType ? state.filterStamp[item.subType] : ''}
                                                isActive={!!isActive}/>
                    })}

                </InnerWrapper>
            </div>
        </OutterWrapper>
    )
};