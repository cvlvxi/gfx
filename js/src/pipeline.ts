import { fragShaderSrc, vertShaderSrc } from "./shaders.js";

export default class GfxPipeline {

    gl: WebGL2RenderingContext;
    vertShader: WebGLShader | undefined;
    fragShader: WebGLShader | undefined;
    program: WebGLProgram | undefined;
    
    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
        this.vertShader = this.createShader(this.gl.VERTEX_SHADER, vertShaderSrc);
        this.fragShader = this.createShader(this.gl.FRAGMENT_SHADER, fragShaderSrc);
        this.program = this.createProgram(this.vertShader, this.fragShader);
        console.log("Done")

    }

    createShader(type: number, source: string): WebGLShader | undefined {
        let shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        if (this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            return shader;
        }
        console.log(this.gl.getShaderInfoLog(shader));
        this.gl.deleteShader(shader);
    }

    createProgram(vertShader: WebGLShader, fragShader: WebGLShader): WebGLProgram | undefined {
        let program: WebGLProgram = this.gl.createProgram();
        this.gl.attachShader(program, vertShader);
        this.gl.attachShader(program, fragShader);
        this.gl.linkProgram(program);
        if (this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            return program;
        }
        console.log(this.gl.getProgramInfoLog(program));
        this.gl.deleteProgram(program);1
    }
}