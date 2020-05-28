import {NormalFilter} from "./shader/normal";
import {createFramebufferTexture, createTexture, deleteFramebuffer, deleteTexture} from "./GLUtil";
import {IdentityObject, Layer, WebGLRenderer} from "../types/type";
import {ColorFilter} from "./shader/Color";
import {render} from "@testing-library/react";


export const WebGL = (gl: WebGLRenderingContext, isSave: boolean = false) => {
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

    const texCoordPoint = new Float32Array([
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0
    ]);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexPoint, gl.STATIC_DRAW);

    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoordPoint, gl.STATIC_DRAW);

    const filters: IdentityObject<WebGLRenderer> = {
        normalFilter: NormalFilter(gl, vertexBuffer, texCoordBuffer),
        colorFilter: ColorFilter(gl, vertexBuffer, texCoordBuffer)
    };
    let [framebuffers, textures] = createFramebufferTexture(gl, 2, width, height);
    const texture = createTexture(gl);
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
    const render = (layers: Layer[]): Array<number> => {
        let layer = layers[0];
        let renderCount = 0;
        if (layer) {
            if (!isSave) {
                vertexPoint = new Float32Array([
                    width / 2 * layer.position.x1, height / 2 * layer.position.y1,
                    width / 2 * layer.position.x2, height / 2 * layer.position.y1,
                    width / 2 * layer.position.x2, height / 2 * layer.position.y2,
                    width / 2 * layer.position.x2, height / 2 * layer.position.y2,
                    width / 2 * layer.position.x1, height / 2 * layer.position.y2,
                    width / 2 * layer.position.x1, height / 2 * layer.position.y1,
                ]);
                gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, vertexPoint, gl.STATIC_DRAW);
            }
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, layer.source);

            gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers[renderCount % 2]);
            gl.useProgram(filters.colorFilter.program);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            gl.bindTexture(gl.TEXTURE_2D, textures[renderCount % 2]);
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, fullPoint, gl.STATIC_DRAW);
            renderCount++;

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            filters.normalFilter && gl.useProgram(filters.normalFilter.program);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            return [~~(width / 2 * (layer.position.x1 + 1)), ~~(height / 2 * (layer.position.y1 + 1)), ~~(width / 2 * (layer.position.x2 + 1)), ~~(height / 2 * (layer.position.y2 + 1))];
        }

        return [];

    };

    return {
        render,
        viewport
    }

};