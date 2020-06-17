import {
    initWebGL,
    createAttributeSetters,
    createUniformSetters,
    createProjection,
    setAttributes,
    setUniforms, createTexture
} from "../GLUtil";
import {useLut} from "../useLut";
import {LutFiltersType, LutFilterType, WebGLRenderer} from "../../types/type";
import {globalEvents} from "../../lib/globalEvents";

export const LutFilter = (gl: WebGLRenderingContext | WebGL2RenderingContext, vertexBuffer: WebGLBuffer | null, texCoordBuffer: WebGLBuffer | null): WebGLRenderer => {
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
        uniform sampler2D inputImageTexture1;
        uniform sampler2D inputImageTexture2;
        
        uniform float intensity; /**< =0.5, ParamIn.UICtrl, ==leftIntensity */
        varying vec2 v_texCoord;
            
        void main() {
            highp vec4 textureColor1 = texture2D( inputImageTexture1, v_texCoord );
        
            highp float blueColor = textureColor1.b * 63.0;
            highp vec2 blueIndex = vec2(floor( blueColor ), ceil( blueColor ));
        
            highp vec4 quad;
            quad.yw = floor(blueIndex/8.0);
            quad.xz = blueIndex - quad.yw*8.0;
        
            highp vec2 texPos;
            texPos.x = ( quad.x * 0.125 ) + 0.5 / 512.0 + ( ( 0.125 - 1.0 / 512.0 ) * textureColor1.r);
            texPos.y = ( quad.y * 0.125 ) + 0.5 / 512.0 + ( ( 0.125 - 1.0 / 512.0 ) * textureColor1.g);
            // texPos.y = 1.0 - texPos.y;
   
            lowp vec4 newColor3_1 = texture2D( inputImageTexture2, texPos);
            gl_FragColor = mix( textureColor1, vec4( newColor3_1.rgb, textureColor1.w ), intensity);
      
    }
    `;
    const {getLuts} = useLut();
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
        intensity: 1
    };
    let lutsImage = getLuts();
    globalEvents.on('manifestLoaded', (luts: Partial<LutFiltersType<ImageBitmap>>) => {
        lutsImage = luts;
    });

    let inputImageTexture1 = gl.getUniformLocation(program, 'inputImageTexture1');
    let inputImageTexture2 = gl.getUniformLocation(program, 'inputImageTexture2');
    gl.uniform1i(inputImageTexture1, 0);
    gl.uniform1i(inputImageTexture2, 1);

    let lutTexture = createTexture(gl);

    const viewport = () => {
        gl.useProgram(program);
        uniforms.u_projection = createProjection(-gl.canvas.width / 2, gl.canvas.width / 2, gl.canvas.height / 2, -gl.canvas.height / 2, 1);
        setAttributes(attributeSetter, attributes);
        setUniforms(uniformSetter, uniforms);
    };


    const setFilter = (type: Partial<LutFilterType>, intensity: number) => {
        if (type && lutsImage[type]) {
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, lutTexture);
            if (lutsImage[type] !== undefined) {
                // @ts-ignore
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, lutsImage[type]);
            }
            gl.activeTexture(gl.TEXTURE0);
        }
        uniforms.intensity = intensity / 100;
        setUniforms(uniformSetter, uniforms);
    };

    setAttributes(attributeSetter, attributes);
    setUniforms(uniformSetter, uniforms);


    return {
        program,
        viewport,
        setFilter
    }
};