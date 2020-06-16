import {FilterTypes} from "webpack/declarations/WebpackOptions";

export enum EditStatus {
    IDLE,
    EDTING
}

export enum ProcessStatus {
    none,
    clip,
    filter,
    light,
    color,
    effect
}

export enum ActionType {
    updateEditStatus,
    addLayer,
    updateCanvasSize,
    savePicture,
    finishSavePicture,
    updateTemperature,
    updateTint,
    updateColorType,
    updateColorValue,
    startClipPath,
    finishClipPath,
    updateTransform,
    updatePosition,
    updateEffectType,
    updateEffectValue,
    updateFilterSubType,
    updateFilterCategory,
    updateFilterIntensity,
    updateFilterStamp,

}

export enum EditType {
    none,
    transform
}


export type IdentityObject<T> = {
    [propsName: string]: T;
}

export type WebGLRenderer = {
    viewport: () => void;
    program: WebGLProgram | null;
    setScale?: (sx: number, sy: number, centerX?: number, centerY?: number) => void
    setColor?: (temperature: number, tint: number, hue: number, saturation: number) => void
    setIntensity?: (intensity: number) => void
    setClip? :(l: number, r: number, t: number, b: number) => void
    setFilter? : (type: LutFilterType, intensity: number) => void
}

export type MyImage = ImageBitmap | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement;
export type Position = {
    x1: number
    y1: number
    x2: number
    y2: number
}
export type Transform = {
    left: number,
    right: number,
    top: number,
    bottom: number,
    scaleX: number,
    scaleY: number,
    offsetX: number,
    offsetY: number,
    rotate: number
}

export type Color = {
    editingProperty: Exclude<keyof Color, 'editingProperty'> | '';
    temperature: number
    tint: number
    hue: number
    saturation: number
}

export type Effect = {
    editingProperty: Exclude<keyof Effect, 'editingProperty'> | '';
    colorOffset: number
}

export type FilterCategoryType = 'cinema' | 'vintage'
export type VintageFilterType = 'normal' | 'flowerStone' | 'fluorite' | 'fluoriteBlue' | 'fluoriteVenus'
export type CinemaFilterType = 'cinema1' | 'cinema2'
export type FilterSubType<T> =
    T extends 'vintage' ? VintageFilterType:
        'normal';

export type Filter<T extends FilterCategoryType> = {
    currentCategory: T
    type: FilterSubType<T>,
    intensity: number
}
export type Layer = {
    editStatus: EditType;
    source: MyImage;
    position: Position;
    originPosition: Position;
    transform: Transform;
    color: Color,
    effect: Effect,
    filter: Filter<FilterCategoryType>
}
export type StateType = {
    editStatus: EditStatus;
    processStatus: ProcessStatus;
    savePicture: boolean;
    layers :Array<Layer>,
    currentLayer: Layer | null,
    width: number,
    height: number,
    filterStamp: LutFiltersType<string>,
}

export type MyWebGLRender = {
    render: (layer: Layer[], onlyRenderOrigin?: boolean) => number[];
    viewport: (width: number, height: number) =>  void

}
export type MyCanvas = {
    renderer: MyWebGLRender,
    canvasElement: HTMLCanvasElement,
    gl: WebGLRenderingContext | WebGL2RenderingContext,
    viewport: (width: number, height: number) => void
} | null;

export type LutFiltersType<T> = {
    [propsName in FilterSubType<FilterCategoryType>]: T
}

export type LutFilterType = FilterSubType<FilterCategoryType>

export interface Picture {
    width: number,
    height: number
}


export enum AdaptionType {
    widthAdaption,
    heightAdaption,
    fill
}