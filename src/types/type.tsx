
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
    updateEffectValue

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
    setColor?: (temperature: number, tint: number, hue: number, saturation: number) => void;
    setIntensity?: (intensity: number) => void,
    setClip? :(l: number, r: number, t: number, b: number) => void;
    setFilter? : (type: LutFilterType) => void
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

export type Layer = {
    editStatus: EditType;
    source: MyImage;
    position: Position;
    originPosition: Position;
    transform: Transform;
    color: Color,
    effect: Effect
}
export type StateType = {
    editStatus: EditStatus;
    processStatus: ProcessStatus;
    savePicture: boolean;
    layers :Array<Layer>,
    currentLayer: Layer | null,
    width: number,
    height: number
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
    flowerStone: T
    fluorite: T
    fluoriteBlue: T
}

export type LutFilterType = keyof LutFiltersType<any>