import {
    initWebGL,
    createAttributeSetters,
    createUniformSetters,
    createProjection,
    setAttributes,
    setUniforms
} from "../GLUtil";
import {WebGLRenderer} from "../../types/type";

export const NormalFilter = (gl: WebGLRenderingContext | WebGL2RenderingContext, vertexBuffer: WebGLBuffer | null, texCoordBuffer: WebGLBuffer | null): WebGLRenderer => {
    const vertexShader = `
    attribute vec4 a_position;
    attribute vec2 a_texCoord;
    varying vec2 v_texCoord;
    uniform mat4 u_projection;
    void main () {
        gl_Position = u_projection * a_position;
        v_texCoord = a_texCoord;
    }
    `;
    const fragmentShader = `
    precision highp float;
    uniform sampler2D u_texture;
    varying vec2 v_texCoord;
    void main () {
        vec4 color = texture2D(u_texture, v_texCoord);
        gl_FragColor = color;
    }
    `;
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    const program = initWebGL(gl, vertexShader, fragmentShader);
    if (!program) {
        return {
            viewport: () => {},
            program: null
        };
    }

    gl.useProgram(program);
    const attributeSetter = createAttributeSetters(gl, program);
    const uniformSetter = createUniformSetters(gl, program);
    const attributes = {
        a_position: {
            numComponents: 2,
            buffer: vertexBuffer
        },
        a_texCoord: {
            numComponents: 2,
            buffer: texCoordBuffer
        }
    };
    const uniforms = {
        u_projection: createProjection(-gl.canvas.width / 2, gl.canvas.width / 2, gl.canvas.height / 2, -gl.canvas.height / 2, 1)
    };

    const viewport = (width: number, height: number) => {
        uniforms.u_projection = createProjection(-gl.canvas.width / 2, gl.canvas.width / 2, gl.canvas.height / 2, -gl.canvas.height / 2, 1);
        setAttributes(attributeSetter, attributes);
        setUniforms(uniformSetter, uniforms);
    };

    setAttributes(attributeSetter, attributes);
    setUniforms(uniformSetter, uniforms);


    return {
        program,
        viewport
    }
};