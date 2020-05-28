
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
    updateTemperature
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
    setColor?: (temperature: number, tint?: number) => void;
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
    temperature: number
    tint?: number
}
export type Layer = {
    editStatus: EditType;
    source: MyImage;
    position: Position;
    originPosition: Position;
    transform: Transform;
    color: Color
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
    render: (layer: Layer[]) => number[];
    viewport: (width: number, height: number) =>  void

}
export type MyCanvas = {
    renderer: MyWebGLRender,
    canvasElement: HTMLCanvasElement,
    gl: WebGLRenderingContext | WebGL2RenderingContext,
    viewport: (width: number, height: number) => void
} | null;