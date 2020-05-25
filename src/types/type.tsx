
export enum EditStatus {
    IDLE,
    EDTING
}

export enum ActionType {
    updateEditStatus,
    addLayer,
    updateCanvasSize
}

export type IdentityObject<T> = {
    [propsName: string]: T;
}

export type WebGLRenderer = {
    viewport: (width: number, height: number) => void;
    program: WebGLProgram | null
}