import {createFramebufferTexture, createTexture} from "./GLUtil";
import {NormalFilter} from "./shader/normal";
import {AdaptionType, LutFiltersType, LutFilterType, WebGLRenderer} from "../types/type";
import {LutFilter} from "./shader/lutFilter";
import {filterStamp} from "../Context";
import {findAdaption} from "../lib/util";

const width = 70 * window.devicePixelRatio;
const height = 70 * window.devicePixelRatio;
const canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;
const gl = canvas.getContext('webgl');
let vertexBuffer: WebGLBuffer | null, texCoordBuffer: WebGLBuffer | null;
let normalFilter: WebGLRenderer, lutFilter: WebGLRenderer;
let originTexture: WebGLTexture | null;
let framebuffers: WebGLFramebuffer[], textures: WebGLTexture[];
let vertexPoint = new Float32Array([
    -width / 2, -height / 2,
    width / 2, -height / 2,
    width / 2, height / 2,
    width / 2, height / 2,
    -width / 2, height / 2,
    -width / 2, -height / 2,
]);

let texCoordPoint = new Float32Array([
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0
]);
if (gl) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    vertexBuffer = gl.createBuffer();
    texCoordBuffer = gl.createBuffer();
    originTexture = createTexture(gl);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexPoint, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoordPoint, gl.STATIC_DRAW);
    normalFilter = NormalFilter(gl, vertexBuffer, texCoordBuffer);
    lutFilter =  LutFilter(gl, vertexBuffer, texCoordBuffer);
    [framebuffers, textures] = createFramebufferTexture(gl, 2, width, height);
}

export const usePreProcess = () => {
    const images: LutFiltersType<string> = filterStamp;
    let cacheImage: HTMLImageElement | null = null;
    const passFramebuffer = (gl: WebGLRenderingContext | WebGL2RenderingContext, program: WebGLProgram | null, renderCount: number, fn: (...args: any) => void, _fn?: (...args: any) => void,): number => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers[renderCount % 2]);
        gl.useProgram(program);
        gl.clear(gl.COLOR_BUFFER_BIT);
        fn();
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.bindTexture(gl.TEXTURE_2D, textures[renderCount % 2]);
        _fn && _fn();
        return ++renderCount;
    };

    const preProcess = (img: HTMLImageElement, type: LutFilterType) => {
        if (gl && normalFilter && lutFilter) {
            let renderCount = 0;
            gl.useProgram(normalFilter.program);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, originTexture);
            if (cacheImage !== img) {
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
                cacheImage = img;
            }
            const aspect = gl.canvas.width / gl.canvas.height;
            const imgAspect = img.width / img.height;
            const adaption = findAdaption(img, aspect, true);
            let scaleX = 1, scaleY = 1;
            if (adaption === AdaptionType.widthAdaption) {
                let _height = width / imgAspect;
                scaleY = _height / gl.canvas.height;
            } else {
                let _width = height * imgAspect;
                scaleX = _width / gl.canvas.width;
            }

            renderCount = passFramebuffer(gl, normalFilter.program, renderCount, () => {
                normalFilter.setScale && normalFilter.setScale(scaleX, scaleY, 0, 0);
            }, () => {
                normalFilter.setScale && normalFilter.setScale(1, 1);
            });
            if (type !== 'normal') {
                passFramebuffer(gl, lutFilter.program, renderCount, () => {
                    lutFilter.setFilter && lutFilter.setFilter(type, 100);
                });
            }

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            normalFilter && gl.useProgram(normalFilter.program);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            // let image = new Image();
            // image.src = url;
            return canvas.toDataURL("image/jpeg");
        }
    };

    const preProcessAll = (img: HTMLImageElement) => {
        for (let key in images) {
            // @ts-ignore
            images[key] = preProcess(img, key as LutFilterType);
        }
        return images;
    };
    return {
        preProcessAll: preProcessAll
    }
};