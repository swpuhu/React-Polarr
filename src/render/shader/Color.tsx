import {
    initWebGL,
    createAttributeSetters,
    createUniformSetters,
    createProjection,
    setAttributes,
    setUniforms, mapValue, createHueRotateMatrix, createSaturateMatrix, createContrastMatrix, createLightnessMatrix
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
    uniform mat4 u_contrast;
    uniform mat4 u_lightness;
    uniform float u_lightPartial;
    uniform float u_darkPartial;   
    varying vec2 v_texCoord;
    
    vec3 YUV2RGB(vec3 YUV) {
        mat3 matYUV2RGB = mat3(
            1.0, 1.0, 1.0,
            0.0, -0.344116, 1.771973,
            1.401978, -0.714111, 0.0
        );
        vec3 rgb = matYUV2RGB * vec3(YUV[0], YUV[1] - 128.0, YUV[2] - 128.0); 
        return rgb;
    }
    
    vec3 RGB2YUV(vec3 RGB) {
        mat3 matRGB2YUV = mat3(
            0.29895, -0.168701, 0.5,
            0.587036, -0.331299, -0.418701,
            0.114014, 0.5, -0.081299
        );
        vec3 mid = matRGB2YUV * RGB;
        vec3 yuv = vec3(mid[0], mid[1] + 128.0, mid[2] + 128.0); 
        return yuv;
    }
    
    const lowp vec3 warmFilter = vec3(0.93, 0.54, 0.0);
    const mediump mat3 RGBtoYIQ = mat3(0.299, 0.587, 0.114, 0.596, -0.274, -0.322, 0.212, -0.523, 0.311);
    const mediump mat3 YIQtoRGB = mat3(1.0, 0.956, 0.621, 1.0, -0.272, -0.647, 1.0, -1.105, 1.702);
    void main () {
        vec4 source = texture2D(u_texture, v_texCoord);
        source = u_hue * u_lightness * u_contrast * u_saturation * source;
        vec3 diff = vec3(u_lightPartial - u_darkPartial);
        vec3 rgbDiff = source.rgb - vec3(u_darkPartial);
        if (rgbDiff.r < 0.) {
            source.r = 0.0;
        } else if (rgbDiff.r > u_lightPartial) {
            source.r = 1.0;
        } else {
            source.r= rgbDiff.r / diff.r;
        }
        if (rgbDiff.g < 0.) {
            source.g = 0.0;
        } else if (rgbDiff.g > u_lightPartial) {
            source.g = 1.0;
        } else {
            source.g= rgbDiff.g / diff.g;
        }
        if (rgbDiff.b < 0.) {
            source.b = 0.0;
        } else if (rgbDiff.b > u_lightPartial) {
            source.b = 1.0;
        } else {
            source.b= rgbDiff.b / diff.b;
        }
        
        
        
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
        u_saturation: createSaturateMatrix(0),
        u_contrast: createContrastMatrix(1),
        u_lightness: createLightnessMatrix(1),
        u_lightPartial: 1,
        u_darkPartial: 1
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

    const setLight = (contrast: number, lightness: number, lightPartial: number, darkPartial: number) => {
        uniforms.u_contrast = createContrastMatrix(contrast);
        uniforms.u_lightness = createLightnessMatrix(lightness);
        uniforms.u_lightPartial = lightPartial;
        uniforms.u_darkPartial = darkPartial;
    };

    setAttributes(attributeSetter, attributes);
    setUniforms(uniformSetter, uniforms);


    return {
        program,
        viewport,
        setColor,
        setLight
    }
};