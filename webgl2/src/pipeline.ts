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
        this.createBuffers()
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

    createBuffers() {
        let posAttribLocation: number = this.gl.getAttribLocation(this.program, "a_position")
        let posBuffer: WebGLBuffer = this.gl.createBuffer();
        // Add Global Bind Point
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, posBuffer);
        // three 2d points
        var positions = [
            0, 0,
            0, 0.5,
            0.7, 0,
        ];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);

        // Vertex Array Object
        let vao = this.gl.createVertexArray();
        this.gl.bindVertexArray(vao);
        this.gl.enableVertexAttribArray(posAttribLocation);

        var size = 2;          // 2 components per iteration
        var type = this.gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        this.gl.vertexAttribPointer(
            posAttribLocation, size, type, normalize, stride, offset)
    }



}