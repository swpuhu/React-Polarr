import React, {useContext} from 'react';
import {Context} from "../../Context";
import {ActionType, FilterCategoryType, FilterSubType} from "../../types/type";
import styled from "styled-components";
import {FilterIndicator} from "../../components/FilterIndicator";
import {ControlSlider} from "../../components/ControlSlider";
import {Icon} from "../../components/Icon";
import {getLastState} from "../../lib/util";

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
            height: 70px;
            margin: 5px;
            padding: 5px 0;
            border: 1px solid #fff;
            border-radius: 5px;
            text-align: center;
            > .icon {
                width: 30px;
                height: 30px;
                fill: #fff;
            }
            > .text {
                margin-top: 5px;
            }
        }
    }
    > .all-filter {
        max-height: 200px;
        overflow: auto;
        > .title {
            background-color: rgb(103, 103, 103);
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
    const {state: states, dispatch} = useContext(Context);
    const layer = getLastState(states.historyLayers);
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
    let showIndicator = indicators.find(item => layer && item.type === layer.filter.currentCategory);
    if (showIndicator && !states.showAllFilter) {
        showIndicator.children.unshift({
            subType: 'normal',
        })
    }
    const changeIntensity = (value: number) => {
        dispatch({type: ActionType.updateFilterIntensity, payload: value})
    };
    const allFilters = indicators.map(firstClass => {
        return (
            <div key={firstClass.type}>
                <div className="title">{firstClass.type}</div>
                <div className="body">
                    {firstClass.children.map((item, index) => {
                        let isActive = layer && layer.filter.type === item.subType;
                        return <FilterIndicator key={item.subType ? item.subType : index} value={layer ? layer.filter.intensity : 0}
                                         min={0}
                                         max={100}
                                         label={item.subType ? labelMap[item.subType] : ''}
                                         className={item.subType ? item.subType : ''}
                                         onClick={() => {
                                             dispatch({type: ActionType.updateFilterCategory, payload: firstClass.type});
                                             dispatch({type: ActionType.updateFilterSubType, payload: item.subType});
                                         }}
                                         background={item.subType ? states.filterStamp[item.subType] : ''}
                                         isActive={!!isActive}/>
                    })}
                </div>
            </div>
        );
    });
    const currentFilter = <InnerWrapper>
            {showIndicator && showIndicator.children.map((item, index) => {
                let isActive = layer && layer.filter.type === item.subType;
                // let value = layer ? layer.filter.intensity : 0;
                return <FilterIndicator key={item.subType ? item.subType : index} value={layer ? layer.filter.intensity : 0}                                            min={0}
                                        max={100}
                                        label={item.subType ? labelMap[item.subType] : ''}
                                        className={item.subType ? item.subType : ''}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            dispatch({type: ActionType.updateFilterSubType, payload: item.subType});
                                        }}
                                        background={item.subType ? states.filterStamp[item.subType] : ''}
                                        isActive={!!isActive}/>
            })}

        </InnerWrapper>;
    console.log(layer);
    return (
        <OutterWrapper>
            {layer && layer.filter.type !== 'normal'
                ? <ControlSlider onChange={changeIntensity} value={layer ? layer.filter.intensity : 0}
                                 min={0} max={100} step={1}
                                 className={'filter-indicator'}/>
                : null}
            {states.showAllFilter ?
                <div className="all-filter">
                    {allFilters}
                </div>:
                <div className="flex">
                    <div className="all-filter" onClick={(e) => {
                        e.stopPropagation();
                        dispatch({type: ActionType.updateShowAllFilter, payload: true});
                    }}>
                        <Icon className="icon" name="page"/>
                        <div className="text">所有滤镜</div>
                    </div>
                    {currentFilter}
                </div>}
        </OutterWrapper>
    )
};