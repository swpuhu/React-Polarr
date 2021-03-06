import {NormalFilter} from "./shader/normal";
import {createFramebufferTexture, createTexture, deleteFramebuffer, deleteTexture, mapValue} from "./GLUtil";
import {EditType, IdentityObject, Layer, MyImage, MyWebGLRender, StateType, WebGLRenderer} from "../types/type";
import {ColorFilter} from "./shader/Color";
import {ColorOffset} from "./shader/colorOffset";
import {LutFilter} from "./shader/lutFilter";
import {AlphaMaskFilter} from "./shader/alphaMaskFilter";
import {SoulFilter} from "./shader/Soul";

const vertexCoord2TexCoordX = mapValue(-1, 1, 0, 1);
const vertexCoord2TexCoordY = mapValue(-1, 1, 1, 0);
const lightMap = mapValue(-100, 100, 0, 2);
const contrastMap = mapValue(-100, 100, 0, 2);
export const WebGL = (gl: WebGLRenderingContext, isSave: boolean = false): MyWebGLRender => {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    let width = gl.canvas.width;
    let height = gl.canvas.height;
    let vertexPoint = new Float32Array([
        -width / 2, -height / 2,
        width / 2, -height / 2,
        width / 2, height / 2,
        width / 2, height / 2,
        -width / 2, height / 2,
        -width / 2, -height / 2,
    ]);
    let fullPoint = vertexPoint;
    let cacheImage: MyImage | null = null;

    let texCoordPoint = new Float32Array([
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0
    ]);
    let fullTexCoord = texCoordPoint;

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexPoint, gl.STATIC_DRAW);

    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoordPoint, gl.STATIC_DRAW);

    const filters: IdentityObject<WebGLRenderer> = {
        normalFilter: NormalFilter(gl, vertexBuffer, texCoordBuffer),
        colorFilter: ColorFilter(gl, vertexBuffer, texCoordBuffer),
        colorOffsetFilter: ColorOffset(gl, vertexBuffer, texCoordBuffer),
        lutFilter: LutFilter(gl, vertexBuffer, texCoordBuffer),
        alphaMaskFilter: AlphaMaskFilter(gl, vertexBuffer, texCoordBuffer),
        soulFilter: SoulFilter(gl, vertexBuffer, texCoordBuffer),
    };
    let [framebuffers, textures] = createFramebufferTexture(gl, 2, width, height);
    let texture = createTexture(gl);
    const viewport = (_width: number, _height: number) => {
        gl.viewport(0, 0, _width, _height);
        width = _width;
        height = _height;
        deleteFramebuffer(gl, framebuffers);
        deleteTexture(gl, textures);
        [framebuffers, textures] = createFramebufferTexture(gl, 2, width, height);
        vertexPoint = new Float32Array([
            -width / 2, -height / 2,
            width / 2, -height / 2,
            width / 2, height / 2,
            width / 2, height / 2,
            -width / 2, height / 2,
            -width / 2, -height / 2,
        ]);
        fullPoint = vertexPoint;
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertexPoint, gl.STATIC_DRAW);
        for (let key in filters) {
            if (filters.hasOwnProperty(key)) {
                let filter = filters[key] as WebGLRenderer;
                filter.viewport();
            }
        }
    };

    const passFramebuffer = (gl: WebGLRenderingContext | WebGL2RenderingContext, program: WebGLProgram | null, renderCount: number, fn: (...args: any) => void, _fn?: (...args: any) => void): number => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers[renderCount % 2]);
        gl.useProgram(program);
        gl.clear(gl.COLOR_BUFFER_BIT);
        fn();
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.bindTexture(gl.TEXTURE_2D, textures[renderCount % 2]);
        _fn && _fn();
        return ++renderCount;
    };

    const render = (state: StateType, layer: Layer | null, renderOrigin?: boolean): Array<number> => {
        let renderCount = 0;
        gl.clear(gl.COLOR_BUFFER_BIT);
        if (layer) {
            if (!isSave) {
                if (state.transformStatus === EditType.transform) {
                    vertexPoint = new Float32Array([
                        width / 2 * layer.originPosition.x1, height / 2 * layer.originPosition.y1,
                        width / 2 * layer.originPosition.x2, height / 2 * layer.originPosition.y1,
                        width / 2 * layer.originPosition.x2, height / 2 * layer.originPosition.y2,
                        width / 2 * layer.originPosition.x2, height / 2 * layer.originPosition.y2,
                        width / 2 * layer.originPosition.x1, height / 2 * layer.originPosition.y2,
                        width / 2 * layer.originPosition.x1, height / 2 * layer.originPosition.y1,
                    ]);
                    texCoordPoint = new Float32Array([
                        0.0, 0.0,
                        1.0, 0.0,
                        1.0, 1.0,
                        1.0, 1.0,
                        0.0, 1.0,
                        0.0, 0.0
                    ]);
                } else {
                    vertexPoint = new Float32Array([
                        width / 2 * layer.position.x1, height / 2 * layer.position.y1,
                        width / 2 * layer.position.x2, height / 2 * layer.position.y1,
                        width / 2 * layer.position.x2, height / 2 * layer.position.y2,
                        width / 2 * layer.position.x2, height / 2 * layer.position.y2,
                        width / 2 * layer.position.x1, height / 2 * layer.position.y2,
                        width / 2 * layer.position.x1, height / 2 * layer.position.y1,
                    ]);

                    texCoordPoint = new Float32Array([
                        0.0 + layer.transform.left, 0.0 + layer.transform.bottom,
                        1.0 - layer.transform.right, 0.0 + layer.transform.bottom,
                        1.0 - layer.transform.right, 1.0 - layer.transform.top,
                        1.0 - layer.transform.right, 1.0 - layer.transform.top,
                        0.0 + layer.transform.left, 1.0 - layer.transform.top,
                        0.0 + layer.transform.left, 0.0 + layer.transform.bottom,
                    ]);
                }
                gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, vertexPoint, gl.STATIC_DRAW);
                gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, texCoordPoint, gl.STATIC_DRAW);
            } else {
                let w = width * (1 - layer.transform.left - layer.transform.right);
                let h = height * (1 - layer.transform.top - layer.transform.bottom);
                gl.canvas.width = w;
                gl.canvas.height = h;
                viewport(w, h);
                texCoordPoint = new Float32Array([
                    0.0 + layer.transform.left, 0.0 + layer.transform.bottom,
                    1.0 - layer.transform.right, 0.0 + layer.transform.bottom,
                    1.0 - layer.transform.right, 1.0 - layer.transform.top,
                    1.0 - layer.transform.right, 1.0 - layer.transform.top,
                    0.0 + layer.transform.left, 1.0 - layer.transform.top,
                    0.0 + layer.transform.left, 0.0 + layer.transform.bottom,
                ]);
                gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, texCoordPoint, gl.STATIC_DRAW);

            }
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            if (cacheImage !== layer.source) {
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, layer.source);
                cacheImage = layer.source;
            }

            if (renderOrigin) {
                filters.normalFilter && gl.useProgram(filters.normalFilter.program);
                gl.drawArrays(gl.TRIANGLES, 0, 6);
            } else {
                renderCount = passFramebuffer(gl, filters.soulFilter.program, renderCount, () => {
                    if (filters.soulFilter.program && filters.soulFilter.setScale) {
                        filters.soulFilter.setScale(layer.effect.soul / 100 + 1, layer.effect.soul / 100 + 1);
                    }
                }, () => {
                    if (filters.soulFilter.program && filters.soulFilter.setScale) {
                        filters.soulFilter.setScale(1, 1);
                    }
                });

                // 第一次渲染要回复到全屏的顶点位置
                gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, fullPoint, gl.STATIC_DRAW);

                gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, fullTexCoord, gl.STATIC_DRAW);

                renderCount = passFramebuffer(gl, filters.colorFilter.program, renderCount, () => {
                    if (filters.colorFilter && filters.colorFilter.setColor && filters.colorFilter.setLight) {
                        filters.colorFilter.setColor(layer.color.temperature, layer.color.tint, layer.color.hue, layer.color.saturation);
                        filters.colorFilter.setLight(contrastMap(layer.light.contrast), lightMap(layer.light.lightness), layer.light.lightPartial / 255, layer.light.darkPartial / 255);
                    }
                });

                renderCount = passFramebuffer(gl, filters.colorOffsetFilter.program, renderCount, () => {
                    if (filters.colorOffsetFilter && filters.colorOffsetFilter.setIntensity) {
                        filters.colorOffsetFilter.setIntensity(layer.effect.colorOffset / 10000);
                    }
                });
                if (layer.filter.type !== 'normal') {
                    renderCount = passFramebuffer(gl, filters.lutFilter.program, renderCount, () => {
                        if (filters.lutFilter.program && filters.lutFilter.setFilter && layer.filter.type !== 'normal') {
                            filters.lutFilter.setFilter(layer.filter.type, layer.filter.intensity);
                        }
                    });
                }
                if (state.transformStatus === EditType.transform) {
                    renderCount = passFramebuffer(gl, filters.alphaMaskFilter.program, renderCount, () => {
                        if (filters.alphaMaskFilter.setClip) {
                            let w = (layer.originPosition.x2 - layer.originPosition.x1);
                            let h = (layer.originPosition.y2 - layer.originPosition.y1);
                            let l = vertexCoord2TexCoordX(layer.originPosition.x1 + w * layer.transform.left);
                            let r = vertexCoord2TexCoordX(layer.originPosition.x2 - w * layer.transform.right);
                            let t = vertexCoord2TexCoordY(layer.originPosition.y1 + h * layer.transform.top);
                            let b = vertexCoord2TexCoordY(layer.originPosition.y2 - h * layer.transform.bottom);
                            filters.alphaMaskFilter.setClip(l, r, t, b);
                        }
                    });
                }

                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                filters.normalFilter && gl.useProgram(filters.normalFilter.program);
                gl.drawArrays(gl.TRIANGLES, 0, 6);
                return [~~(width / 2 * (layer.position.x1 + 1)), ~~(height / 2 * (layer.position.y1 + 1)), ~~(width / 2 * (layer.position.x2 + 1)), ~~(height / 2 * (layer.position.y2 + 1))];
            }
        }

        return [];

    };

    return {
        render,
        viewport
    }

};