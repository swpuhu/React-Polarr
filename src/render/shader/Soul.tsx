import {
    initWebGL,
    createAttributeSetters,
    createUniformSetters,
    createProjection,
    setAttributes,
    setUniforms, createScaleMatrix
} from "../GLUtil";
import {WebGLRenderer} from "../../types/type";

export const SoulFilter = (gl: WebGLRenderingContext | WebGL2RenderingContext, vertexBuffer: WebGLBuffer | null, texCoordBuffer: WebGLBuffer | null): WebGLRenderer => {
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
    uniform vec2 u_scale;
    uniform float u_intensity;
    varying vec2 v_texCoord;
    void main () {
        vec2 pos = (v_texCoord - vec2(0.5, 0.5)) / u_scale + vec2(0.5, 0.5);
        vec4 oriColor = texture2D(u_texture, v_texCoord);
        vec4 color = texture2D(u_texture, pos);
        gl_FragColor = vec4(color.rgb * u_intensity  + oriColor.rgb * (1.0 - u_intensity), color.a - (1.0 - u_intensity) * (1.0 - color.a));;
    }
    `;
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
        u_projection: createProjection(-gl.canvas.width / 2, gl.canvas.width / 2, gl.canvas.height / 2, -gl.canvas.height / 2, 1),
        u_scale: [1, 1],
        u_intensity: 0.5
    };

    const viewport = () => {
        gl.useProgram(program);
        uniforms.u_projection = createProjection(-gl.canvas.width / 2, gl.canvas.width / 2, gl.canvas.height / 2, -gl.canvas.height / 2, 1);
        setAttributes(attributeSetter, attributes);
        setUniforms(uniformSetter, uniforms);
    };

    const setScale = (sx: number, sy: number) => {
        uniforms.u_scale = [sx, sy];
        if (sx === 1) {
            uniforms.u_intensity = 1;
        } else {
            uniforms.u_intensity = 1 - Math.log10(sx * 2);
        }
        setUniforms(uniformSetter, uniforms);
    };

    setAttributes(attributeSetter, attributes);
    setUniforms(uniformSetter, uniforms);


    return {
        program,
        viewport,
        setScale
    }
};