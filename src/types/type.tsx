
export enum EditStatus {
    IDLE,
    EDTING
}

export enum ActionType {
    updateEditStatus,
    addLayer,
    updateCanvasSize,
    savePicture,
    finishSavePicture
}

export enum EditType {
    none,
    transform
}


export type IdentityObject<T> = {
    [propsName: string]: T;
}

export type WebGLRenderer = {
    viewport: (width: number, height: number) => void;
    program: WebGLProgram | null
}

export type MyImage = ImageBitmap | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement;
export type Position = {
    x1: number
    y1: number
    x2: number
    y2: number
}
export type Layer = {
    editStatus: EditType;
    source: MyImage;
    position: Position;
    originPosition: Position;
    transform: {
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
}
export type StateType = {
    editStatus: EditStatus;
    savePicture: boolean;
    layers :Array<Layer>,
    width: number,
    height: number
}