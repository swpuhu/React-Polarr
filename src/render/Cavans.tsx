import {WebGL} from "./WebGL";

export const Canvas = (width: number, height: number) => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl', {
        premultipliedAlpha: false,
        alpha: false,
        antialias: true
    });
    if (!gl) return null;
    const renderer = WebGL(gl);

    const viewport = (width:number, height: number) => {
        canvas.width = width;
        canvas.height = height;
        renderer.viewport(width, height);
    };
    return {
        renderer: renderer,
        canvasElement: canvas,
        viewport: viewport
    }

}