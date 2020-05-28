import {WebGL} from "./WebGL";
import {MyCanvas} from "../types/type";

export const Canvas = (width: number, height: number, isSave: boolean = false): MyCanvas => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    const gl = canvas.getContext('webgl', {
        premultipliedAlpha: false,
        alpha: false,
        antialias: true
    });
    if (!gl) return null;
    const renderer = WebGL(gl, isSave);

    const viewport = (width:number, height: number) => {
        canvas.width = width;
        canvas.height = height;
        renderer.viewport(width, height);
    };
    return {
        renderer: renderer,
        canvasElement: canvas,
        gl: gl,
        viewport: viewport
    }
}