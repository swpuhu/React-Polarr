export function createShader (gl: WebGLRenderingContext | WebGL2RenderingContext, type: GLenum, source: string) {
    let shader = gl.createShader(type);
    if (shader) {
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {
            return shader;
        }
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }
}


export function createProgram (gl: WebGLRenderingContext | WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    let program = gl.createProgram();
    if (program) {
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        let success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
            return program;
        }
        console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }
}


export function initWebGL (gl: WebGLRenderingContext | WebGL2RenderingContext, vertexSource: string, fragmentSource: string): WebGLProgram | undefined {
    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    if (vertexShader && fragmentShader) {
        return createProgram(gl, vertexShader, fragmentShader);
    }
}


export function createProjection (l: number, r: number, t: number, b: number, depth: number) {
    return [
        2 / (r - l), 0, 0, 0,
        0, 2 / (t - b), 0, 0,
        0, 0, 2 / depth, 0,
        -(l + r) / (r - l), -(t + b) / (t - b), -1, 1,
    ];
}


export function createRotateMatrix (center: {x: number, y: number, z: number}, rotate: number, axis: ('x' | 'y' | 'z') = 'z') {
    let cos = Math.cos(rotate * Math.PI / 180);
    let sin = Math.sin(rotate * Math.PI / 180);
    if (!center.z) {
        center.z = 0;
    }
    let ret;
    switch (axis) {
        case 'x':
            ret = new Float32Array([
                1.0, 0.0, 0.0, 0.0,
                0.0, cos, sin, 0.0,
                0.0, -sin, cos, 0.0,
                0.0, (1 - cos) * center.y + sin * center.z, (1 - cos) * center.z - sin * center.y, 1.0
            ]);
            break;
        case 'y':
            ret = new Float32Array([
                cos, 0.0, sin, 0.0,
                0.0, 1.0, 0.0, 0.0,
                -sin, 0.0, cos, 0.0,
                (1 - cos) * center.x + sin * center.z, 0.0, (1 - cos) * center.z - sin * center.x, 1.0
            ]);
            break;
        default:
            ret = new Float32Array([
                cos, sin, 0.0, 0.0,
                -sin, cos, 0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                (1 - cos) * center.x + sin * center.y, (1 - cos) * center.y - sin * center.x, 0.0, 1.0,
            ]);
    }
    return ret;
}


export function createTranslateMatrix (tx = 0, ty = 0, tz = 0) {
    return new Float32Array([
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        tx, ty, tz, 1.0,
    ]);
}


export function createScaleMatrix (scaleX: number, scaleY: number, scaleZ: number, center = {
    x: 0,
    y: 0,
    z: 0
}) {
    return new Float32Array([
        scaleX, 0.0, 0.0, 0.0,
        0.0, scaleY, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        -scaleX * center.x + center.x, -scaleY * center.y + center.y, -scaleZ * center.z + center.z, 1.0,
    ]);
}


export function createContrastMatrix (value = 0) {
    return new Float32Array([
        value, 0.0, 0.0, 0.0,
        0.0, value, 0.0, 0.0,
        0.0, 0.0, value, 0.0,
        0.5 * (1 - value), 0.5 * (1 - value), 0.5 * (1 - value), 1.0,
    ]);
}

export function createHueRotateMatrix (value = 0) {
    let sin = Math.sin(value * Math.PI / 180);
    let cos = Math.cos(value * Math.PI / 180);
    return new Float32Array([
        0.213 + cos * 0.787 - sin * 0.213, 0.213 - cos * 0.213 + sin * 0.143, 0.213 - cos * 0.213 - sin * 0.787, 0.0,
        0.715 - cos * 0.715 - sin * 0.715, 0.715 + cos * 0.285 + sin * 0.140, 0.715 - cos * 0.715 + sin * 0.715, 0.0,
        0.072 - cos * 0.072 + sin * 0.928, 0.072 - cos * 0.072 - sin * 0.283, 0.072 + cos * 0.928 + sin * 0.072, 0.0,
        0.0, 0.0, 0.0, 1.0,
    ]);
}

export function createSaturateMatrix (value = 0) {
    return new Float32Array([
        0.3086 * (1 - value) + value, 0.3086 * (1 - value), 0.3086 * (1 - value), 0.0,
        0.6094 * (1 - value), 0.6094 * (1 - value) + value, 0.6094 * (1 - value), 0.0,
        0.0820 * (1 - value), 0.0820 * (1 - value), 0.0820 * (1 - value) + value, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]);
}


export function createTexture (gl: WebGLRenderingContext | WebGL2RenderingContext) {
    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return texture;
}

type UniformSetter = {}
type AttributeSetter = {}
export function createUniformSetters (gl: WebGLRenderingContext | WebGL2RenderingContext, program: WebGLProgram): UniformSetter {
    function createUniformSetter (program: WebGLProgram, uniformInfo: WebGLActiveInfo) {
        const location = gl.getUniformLocation(program, uniformInfo.name);
        const type = uniformInfo.type;
        // Check if this uniform is an array
        const isArray = (uniformInfo.size > 1 && uniformInfo.name.substr(-3) === '[0]');
        if (type === gl.FLOAT && isArray) {
            return function (v: Iterable<number>) {
                gl.uniform1fv(location, v);
            };
        }
        if (type === gl.FLOAT) {
            return function (v: number) {
                gl.uniform1f(location, v);
            };
        }
        if (type === gl.FLOAT_VEC2) {
            return function (v: Iterable<number>) {
                gl.uniform2fv(location, v);
            };
        }
        if (type === gl.FLOAT_VEC3) {
            return function (v: Iterable<number>) {
                gl.uniform3fv(location, v);
            };
        }
        if (type === gl.FLOAT_VEC4) {
            return function (v: Iterable<number>) {
                gl.uniform4fv(location, v);
            };
        }
        if (type === gl.INT && isArray) {
            return function (v: Iterable<number>) {
                gl.uniform1iv(location, v);
            };
        }
        if (type === gl.INT) {
            return function (v: number) {
                gl.uniform1i(location, v);
            };
        }
        if (type === gl.INT_VEC2) {
            return function (v: Iterable<number>) {
                gl.uniform2iv(location, v);
            };
        }
        if (type === gl.INT_VEC3) {
            return function (v: Iterable<number>) {
                gl.uniform3iv(location, v);
            };
        }
        if (type === gl.INT_VEC4) {
            return function (v: Iterable<number>) {
                gl.uniform4iv(location, v);
            };
        }
        if (type === gl.BOOL) {
            return function (v: Iterable<number>) {
                gl.uniform1iv(location, v);
            };
        }
        if (type === gl.BOOL_VEC2) {
            return function (v: Iterable<number>) {
                gl.uniform2iv(location, v);
            };
        }
        if (type === gl.BOOL_VEC3) {
            return function (v: Iterable<number>) {
                gl.uniform3iv(location, v);
            };
        }
        if (type === gl.BOOL_VEC4) {
            return function (v: Iterable<number>) {
                gl.uniform4iv(location, v);
            };
        }
        if (type === gl.FLOAT_MAT2) {
            return function (v: Iterable<number>) {
                gl.uniformMatrix2fv(location, false, v);
            };
        }
        if (type === gl.FLOAT_MAT3) {
            return function (v: Iterable<number>) {
                gl.uniformMatrix3fv(location, false, v);
            };
        }
        if (type === gl.FLOAT_MAT4) {
            return function (v: Iterable<number>) {
                gl.uniformMatrix4fv(location, false, v);
            };
        }
        // if ((type === gl.SAMPLER_2D || type === gl.SAMPLER_CUBE) && isArray) {
        //     const units = [];
        //     for (let ii = 0; ii < info.size; ++ii) {
        //         units.push(textureUnit++);
        //     }
        //     return function () {};
            // return function (bindPoint, units) {
            //     return function (textures) {
            //         gl.uniform1iv(location, units);
            //         textures.forEach(function (texture, index) {
            //             gl.activeTexture(gl.TEXTURE0 + units[index]);
            //             gl.bindTexture(bindPoint, texture);
            //         });
            //     };
            // }(getBindPointForSamplerType(gl, type), units);
        // }
        if (type === gl.SAMPLER_2D || type === gl.SAMPLER_CUBE) {
            return function(){}
            // return function (bindPoint, unit) {
            //     return function (texture) {
            //         gl.uniform1i(location, unit);
            //         gl.activeTexture(gl.TEXTURE0 + unit);
            //         gl.bindTexture(bindPoint, texture);
            //     };
            // }(getBindPointForSamplerType(gl, type), textureUnit++);
        }
        throw new Error('unknown type: 0x' + type.toString(16)); // we should never get here.
    }

    const uniformSetters = {};
    const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

    for (let ii = 0; ii < numUniforms; ++ii) {
        const uniformInfo = gl.getActiveUniform(program, ii);
        if (!uniformInfo) {
            break;
        }
        let name = uniformInfo.name;
        // remove the array suffix.
        if (name.substr(-3) === '[0]') {
            name = name.substr(0, name.length - 3);
        }
        // @ts-ignore
        uniformSetters[name] = createUniformSetter(program, uniformInfo);
    }
    return uniformSetters;
}


export function createAttributeSetters (gl: WebGLRenderingContext | WebGL2RenderingContext, program: WebGLProgram):AttributeSetter {
    const attribSetters = {
    };

    function createAttribSetter (index: number) {
        return function (b: {buffer: WebGLBuffer, numComponents: number, type: GLenum, normalize: boolean, stride: number, offset: number}) {
            gl.bindBuffer(gl.ARRAY_BUFFER, b.buffer);
            gl.enableVertexAttribArray(index);
            gl.vertexAttribPointer(
                index, b.numComponents, b.type || gl.FLOAT, b.normalize || false, b.stride || 0, b.offset || 0);
        };
    }

    const numAttribs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
    for (let ii = 0; ii < numAttribs; ++ii) {
        const attribInfo = gl.getActiveAttrib(program, ii);
        if (!attribInfo) {
            break;
        }
        const index = gl.getAttribLocation(program, attribInfo.name);
        // @ts-ignore
        attribSetters[attribInfo.name] = createAttribSetter(index);
    }

    return attribSetters;
}



export function setUniforms (setters: UniformSetter | any, values: any) {
    setters = setters.uniformSetters || setters;
    Object.keys(values).forEach(function (name) {
        const setter = setters[name];
        if (setter) {
            setter(values[name]);
        }
    });
}

export function setAttributes (setters: AttributeSetter | any, attribs: any) {
    setters = setters.attribSetters || setters;
    Object.keys(attribs).forEach(function (name) {
        const setter = setters[name];
        if (setter) {
            setter(attribs[name]);
        }
    });
}

export function createFramebufferTexture (gl: WebGLRenderingContext | WebGL2RenderingContext, number: number, width: number, height: number): [WebGLFramebuffer[], WebGLTexture[]] {
    let framebuffers: Array<WebGLFramebuffer> = [];
    let textures: Array<WebGLTexture> = [];
    for (let i = 0; i < number; i++) {
        let framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        let texture = createTexture(gl);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        texture && textures.push(texture);
        framebuffer && framebuffers.push(framebuffer);
    }
    return [framebuffers, textures];
}


export function deleteFramebuffer(gl: WebGLRenderingContext | WebGL2RenderingContext, frameBuffer: WebGLFramebuffer | WebGLFramebuffer[]): void {
    if (Array.isArray(frameBuffer)) {
        for (let i = 0; i < frameBuffer.length; i++) {
            gl.deleteFramebuffer(frameBuffer[i]);
        }
        frameBuffer.length = 0;
    } else {
        gl.deleteFramebuffer(frameBuffer);
    }
}


export function deleteTexture(gl: WebGLRenderingContext | WebGL2RenderingContext, texture: WebGLTexture | WebGLTexture[]): void {
    if (Array.isArray(texture)) {
        for (let i = 0; i < texture.length; i++) {
            gl.deleteTexture(texture[i]);
        }
        texture.length = 0;
    } else {
        gl.deleteTexture(texture);
    }
}

export function mapValue(v1: number, v2: number, w1: number, w2: number): (v: number) => number {
    return function (v) {
        return (w1 - w2) / (v1 - v2) * v + ((w2 * v1 - -w2 * v2) / (v1 - v2));
    }
}

export function roundNumber(value: number, step: number) {
    let x = Math.round(value / step);
    return step * x;
}