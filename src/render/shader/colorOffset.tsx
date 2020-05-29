import {
    initWebGL,
    createAttributeSetters,
    createUniformSetters,
    createProjection,
    setAttributes,
    setUniforms
} from "../GLUtil";
import {WebGLRenderer} from "../../types/type";

export const ColorOffset = (gl: WebGLRenderingContext | WebGL2RenderingContext, vertexBuffer: WebGLBuffer | null, texCoordBuffer: WebGLBuffer | null): WebGLRenderer => {
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
    uniform float u_offset;
    uniform vec2 u_resolution;
    void main () {
        vec4 color = texture2D(u_texture, v_texCoord);
        float offsetX = u_offset;
        float offsetY = u_offset;
        vec2 one_pixel = 1.0 / u_resolution;
        vec2 offsetCoord = vec2(offsetX, offsetY);
        vec4 maskR = texture2D(u_texture, v_texCoord - offsetCoord);
        vec4 maskG = texture2D(u_texture, v_texCoord + offsetCoord);
        gl_FragColor = vec4(maskR.r, maskG.g, color.b, color.a);
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
        u_resolution: [gl.canvas.width, gl.canvas.height],
        u_offset: 0
    };

    const viewport = () => {
        gl.useProgram(program);
        uniforms.u_projection = createProjection(-gl.canvas.width / 2, gl.canvas.width / 2, gl.canvas.height / 2, -gl.canvas.height / 2, 1);
        uniforms.u_resolution = [gl.canvas.width, gl.canvas.height];
        setAttributes(attributeSetter, attributes);
        setUniforms(uniformSetter, uniforms);
    };
    const setIntensity = (intensity: number) => {
        uniforms.u_offset = intensity;
        setAttributes(attributeSetter, attributes);
        setUniforms(uniformSetter, uniforms);
    };
    setAttributes(attributeSetter, attributes);
    setUniforms(uniformSetter, uniforms);


    return {
        program,
        viewport,
        setIntensity
    }
};