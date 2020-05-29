import {
    initWebGL,
    createAttributeSetters,
    createUniformSetters,
    createProjection,
    setAttributes,
    setUniforms, mapValue, createHueRotateMatrix, createSaturateMatrix
} from "../GLUtil";
import {WebGLRenderer} from "../../types/type";

export const ColorFilter = (gl: WebGLRenderingContext | WebGL2RenderingContext, vertexBuffer: WebGLBuffer | null, texCoordBuffer: WebGLBuffer | null): WebGLRenderer => {
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
    uniform float u_temperature;
    uniform float u_tint;
    uniform mat4 u_hue;
    uniform mat4 u_saturation;
    varying vec2 v_texCoord;
    
    const lowp vec3 warmFilter = vec3(0.93, 0.54, 0.0);
    const mediump mat3 RGBtoYIQ = mat3(0.299, 0.587, 0.114, 0.596, -0.274, -0.322, 0.212, -0.523, 0.311);
    const mediump mat3 YIQtoRGB = mat3(1.0, 0.956, 0.621, 1.0, -0.272, -0.647, 1.0, -1.105, 1.702);
    void main () {
        vec4 source = texture2D(u_texture, v_texCoord);
        source = u_hue * u_saturation * source;
        mediump vec3 yiq = RGBtoYIQ * source.rgb;
        yiq.b = clamp(yiq.b + u_tint * 0.5226 * 0.1, -0.5226, 0.5226);
        lowp vec3 rgb = YIQtoRGB * yiq;
        lowp vec3 processed = vec3(
            (rgb.r < 0.5 ? (2.0 * rgb.r * warmFilter.r) : (1.0 - 2.0 * (1.0 - rgb.r) * (1.0 - warmFilter.r))), //adjusting temperature
            (rgb.g < 0.5 ? (2.0 * rgb.g * warmFilter.g) : (1.0 - 2.0 * (1.0 - rgb.g) * (1.0 - warmFilter.g))), 
            (rgb.b < 0.5 ? (2.0 * rgb.b * warmFilter.b) : (1.0 - 2.0 * (1.0 - rgb.b) * (1.0 - warmFilter.b))));
        gl_FragColor = vec4(mix(rgb, processed, u_temperature), source.a);
    }
    `;
    const program = initWebGL(gl, vertexShader, fragmentShader);
    if (!program) {
        return {
            viewport: () => {},
            program: null,
            setColor: () => {}
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
        u_temperature: 0,
        u_tint: 0,
        u_hue: createHueRotateMatrix(0),
        u_saturation: createSaturateMatrix(0)
    };

    const viewport = () => {
        uniforms.u_projection = createProjection(-gl.canvas.width / 2, gl.canvas.width / 2, gl.canvas.height / 2, -gl.canvas.height / 2, 1);
        gl.useProgram(program);
        setAttributes(attributeSetter, attributes);
        setUniforms(uniformSetter, uniforms);
    };
    const mapTemperature = mapValue(-100, 100, 0, 10000);
    const mapSaturation = mapValue(-100, 100, 0, 2);
    const setColor = (temperature: number, tint: number, hue: number, saturation: number) => {
        // temperature -100 ~ 100 map to 0 ~ 10000
        temperature = mapTemperature(temperature);
        saturation = mapSaturation(saturation);
        uniforms.u_tint = tint / 100;
        uniforms.u_hue = createHueRotateMatrix(hue);
        uniforms.u_saturation = createSaturateMatrix(saturation);
        uniforms.u_temperature = temperature < 5000 ? 0.0002 * (temperature-5000.0) : 0.00007 * (temperature-5000.0);
        setUniforms(uniformSetter, uniforms);
    };

    setAttributes(attributeSetter, attributes);
    setUniforms(uniformSetter, uniforms);


    return {
        program,
        viewport,
        setColor
    }
};