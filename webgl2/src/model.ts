import { AttributeDescription, ShaderBundle } from "./types";
import { Matrix3 } from "math.gl";

export class Buffer {
  buf: WebGLBuffer | null;

  constructor(
    gl: WebGL2RenderingContext,
    data: Float32Array,
    drawType: GLenum = gl.STATIC_DRAW,
  ) {
    this.buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
    gl.bufferData(gl.ARRAY_BUFFER, data, drawType);
  }
}

export interface ModelDrawProperties {
  offset: number;
  count: number;
  primitiveType: GLenum;
}

export class Model {
  gl: WebGL2RenderingContext;
  vs: ShaderBundle;
  fs: ShaderBundle;
  buf: Buffer;
  drawProperties: ModelDrawProperties;
  debug: boolean;
  program: WebGLProgram | null;
  vao: WebGLVertexArrayObject | null;

  constructor(
    gl: WebGL2RenderingContext,
    vertexBundle: ShaderBundle,
    fragmentBundle: ShaderBundle,
    buf: Buffer,
    drawProperties: ModelDrawProperties,
    debug: boolean = false,
  ) {
    this.debug = debug;
    this.gl = gl;
    this.drawProperties = drawProperties;
    vertexBundle.shader = this.createShader(
      gl.VERTEX_SHADER,
      vertexBundle.source,
    );
    fragmentBundle.shader = this.createShader(
      gl.FRAGMENT_SHADER,
      fragmentBundle.source,
    );
    this.vs = vertexBundle;
    this.fs = fragmentBundle;
    this.buf = buf;

    // Setup Program
    this.setupProgram();
  }

  createShader(type: number, source: string): WebGLShader | null {
    let shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      return shader;
    }
    console.log(this.gl.getShaderInfoLog(shader));
    this.gl.deleteShader(shader);
  }

  createProgram(): WebGLProgram | undefined {
    let program: WebGLProgram = this.gl.createProgram();
    this.gl.attachShader(program, this.vs.shader);
    this.gl.attachShader(program, this.fs.shader);
    this.gl.linkProgram(program);

    this.updateShaderBundles(program);

    if (this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      return program;
    }
    console.log(this.gl.getProgramInfoLog(program));
    this.gl.deleteProgram(program);
  }

  update() {
    // Do some updating here, e.g. uniform update
    let m3 = new Matrix3().identity;
  }

  draw() {
    this.gl.drawArrays(
      this.drawProperties.primitiveType,
      this.drawProperties.offset,
      this.drawProperties.count,
    );
  }

  enableAttributes() {
    for (let [key, attributeDescription] of this.vs.attributeMap.entries()) {
      this.gl.enableVertexAttribArray(attributeDescription.location);
    }
  }

  setupProgram() {
    this.program = this.createProgram();
    // Enable the model's positionAttribIndex
    this.setupVAO();
    this.setupViewPort();
    this.gl.useProgram(this.program);
    this.gl.bindVertexArray(this.vao);
  }

  setupVAO() {
    this.vao = this.gl.createVertexArray();
    this.gl.bindVertexArray(this.vao);

    // Enable attributes
    this.enableAttributes();
    for (let attributeDescription of this.vs.attributeMap.values()) {
      if (this.debug) {
        console.log("Checking vertexAttribPointer Attributes");
        console.log(`positionAttribIndex: ${attributeDescription.location}`);
        console.log(`size: ${attributeDescription.size}`);
        console.log(`type: ${attributeDescription.type}`);
        console.log(`normalize: ${attributeDescription.normalize}`);
        console.log(`stride: ${attributeDescription.stride}`);
        console.log(`offset: ${attributeDescription.offset}`);
      }
      this.gl.vertexAttribPointer(
        attributeDescription.location,
        attributeDescription.size,
        attributeDescription.type,
        attributeDescription.normalize,
        attributeDescription.stride,
        attributeDescription.offset,
      );
    }
  }

  // More camera related?
  setupViewPort() {
    // Tell WebGL how to convert from clip space to pixels
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    // Clear the canvas
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  updateShaderBundle(
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
    bundle: ShaderBundle,
  ) {
    if (bundle.attributeMap) {
      for (let key of bundle.attributeMap.keys()) {
        let desc: AttributeDescription = bundle.attributeMap.get(key);
        desc.location = gl.getAttribLocation(program, key);
        bundle.attributeMap.set(key, desc);
      }
    }
    if (bundle.uniformMap) {
      for (let key of bundle.uniformMap.keys()) {
        let val = gl.getUniformLocation(program, key);
        bundle.uniformMap.set(key, val);
      }
    }
  }

  updateShaderBundles(program: WebGLProgram) {
    this.updateShaderBundle(this.gl, program, this.vs);
    this.updateShaderBundle(this.gl, program, this.fs);
  }
}
