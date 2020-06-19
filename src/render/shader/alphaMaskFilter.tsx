import {
    initWebGL,
    createAttributeSetters,
    createUniformSetters,
    createProjection,
    setAttributes,
    setUniforms, createScaleMatrix
} from "../GLUtil";
import {WebGLRenderer} from "../../types/type";

export const AlphaMaskFilter = (gl: WebGLRenderingContext | WebGL2RenderingContext, vertexBuffer: WebGLBuffer | null, texCoordBuffer: WebGLBuffer | null): WebGLRenderer => {
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
    uniform vec4 u_clip;
    varying vec2 v_texCoord;
    void main () {
        float l = u_clip.x;
        float r = u_clip.y;
        float t = u_clip.z;
        float b = u_clip.w;
        vec4 color = texture2D(u_texture, v_texCoord);
        if (v_texCoord.x >= l && v_texCoord.x <= r && v_texCoord.y >= b && v_texCoord.y <= t) {
            gl_FragColor = color;    
        } else {
            vec4 color2 = vec4(0.0, 0.0, 0.0, 0.5);
            gl_FragColor = vec4(color2.rgb  + color.rgb * (1.0 - color2.a), 1.0 - (1.0 - color.a) * (1.0 - color2.a));
        }
        
        
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
        u_clip: [0.2, 0.8, 0.8, 0.2],
    };

    const viewport = () => {
        gl.useProgram(program);
        uniforms.u_projection = createProjection(-gl.canvas.width / 2, gl.canvas.width / 2, gl.canvas.height / 2, -gl.canvas.height / 2, 1);
        setAttributes(attributeSetter, attributes);
        setUniforms(uniformSetter, uniforms);
    };

    const setClip = (l: number, r: number, t: number, b: number) => {
        uniforms.u_clip = [l, r, t, b];
        setUniforms(uniformSetter, uniforms);
    }


    setAttributes(attributeSetter, attributes);
    setUniforms(uniformSetter, uniforms);


    return {
        program,
        viewport,
        setClip
    }
};