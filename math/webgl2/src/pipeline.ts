export class Buffer {
  buf: WebGLBuffer | null;
  type: GLenum;
  drawType: GLenum;
  vertexCount: number;
  normalize: boolean;
  stride: number;
  offset: number;

  constructor(
    gl: WebGL2RenderingContext,
    data: Float32Array,
    vertexCount: number = 2, // 2 components per iteration
    drawType: GLenum = gl.STATIC_DRAW,
    normalize: boolean = false,
    stride: number = 0, // move forward size * sizeof(type) each iteration
    offset: number = 0, // start at beginning of buffer
  ) {
    this.buf = gl.createBuffer();
    this.vertexCount = vertexCount;
    this.drawType = drawType;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
    gl.bufferData(gl.ARRAY_BUFFER, data, this.drawType);
    this.normalize = normalize;
    this.stride = stride;
    this.offset = offset;
    this.type = gl.FLOAT;
  }
}

export type AttributeIdxMap = Map<string, GLuint | null>;
export type UniformMap = Map<string, WebGLUniformLocation | null>;

export interface ShaderBundle {
  shader?: WebGLShader;
  source: string;
  attributeMap?: AttributeIdxMap;
  uniformMap?: UniformMap;
}

export class Model {
  gl: WebGL2RenderingContext;
  vs: ShaderBundle;
  fs: ShaderBundle;
  positionAttributeName: string;
  buf: Buffer;

  constructor(
    gl: WebGL2RenderingContext,
    vertexBundle: ShaderBundle,
    fragmentBundle: ShaderBundle,
    positionAttributeName: string,
    buf: Buffer,
  ) {
    this.gl = gl;
    if (!vertexBundle.source.includes(positionAttributeName)) {
      throw new Error(
        `Could not find ${positionAttributeName} in vertex shader source`,
      );
    }
    this.positionAttributeName = positionAttributeName;
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

  getPositionIndex(program: WebGLProgram): GLuint {
    this.updateShaderBundleIdxMap(this.gl, program, this.vs);
    return this.vs.attributeMap.get(this.positionAttributeName);
  }

  updateShaderBundleIdxMap(
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
    bundle: ShaderBundle,
  ) {
    if (bundle.attributeMap) {
      for (let key of bundle.attributeMap.keys()) {
        bundle.attributeMap.set(key, gl.getAttribLocation(program, key));
      }
    }
    if (bundle.uniformMap) {
      for (let key of bundle.uniformMap.keys()) {
        bundle.uniformMap.set(key, gl.getUniformLocation(program, key));
      }
    }
  }

  updateShaderBundleIdxMaps(program: WebGLProgram) {
    this.updateShaderBundleIdxMap(this.gl, program, this.vs);
    this.updateShaderBundleIdxMap(this.gl, program, this.fs);
  }
}

export class GfxPipeline {
  gl: WebGL2RenderingContext;
  m: Model;
  program: WebGLProgram | null;
  positionAttribIndex: GLuint;
  vao: WebGLVertexArrayObject | null;
  debug: boolean;

  constructor(gl: WebGL2RenderingContext, m: Model, debug: boolean = false) {
    this.gl = gl;
    this.m = m;
    this.debug = debug;
    this.setup();
  }

  createProgram(model: Model): WebGLProgram | undefined {
    let program: WebGLProgram = this.gl.createProgram();
    this.gl.attachShader(program, model.vs.shader);
    this.gl.attachShader(program, model.fs.shader);
    this.gl.linkProgram(program);

    // Update Indexes
    this.m.updateShaderBundleIdxMaps(program);

    this.positionAttribIndex = this.m.getPositionIndex(program);
    if (this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      return program;
    }
    console.log(this.gl.getProgramInfoLog(program));
    this.gl.deleteProgram(program);
  }

  draw() {
    // draw
    let primitiveType = this.gl.TRIANGLES;
    let offset = 0;
    let count = 3;
    this.gl.drawArrays(primitiveType, offset, count);
  }

  onWindowResize() {
    this.gl.canvas.width = window.innerWidth;
    this.gl.canvas.height = window.innerHeight;
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  }

  setup() {
    this.program = this.createProgram(this.m);
    // Enable the model's positionAttribIndex
    this.setupVAO();
    this.setupViewPort();
    this.gl.useProgram(this.program);
    this.gl.bindVertexArray(this.vao);
  }

  setupVAO() {
    this.vao = this.gl.createVertexArray();
    this.gl.bindVertexArray(this.vao);
    let positionIdx = this.m.getPositionIndex(this.program);
    this.gl.enableVertexAttribArray(positionIdx);

    if (this.debug) {
      console.log("Checking vertexAttribPointer Attributes");
      console.log(`positionAttribIndex: ${positionIdx}`);
      console.log(`size: ${this.m.buf.vertexCount}`);
      console.log(`type: ${this.m.buf.type}`);
      console.log(`normalize: ${this.m.buf.normalize}`);
      console.log(`stride: ${this.m.buf.stride}`);
      console.log(`offset: ${this.m.buf.offset}`);
    }
    this.gl.vertexAttribPointer(
      positionIdx,
      this.m.buf.vertexCount,
      this.m.buf.type,
      this.m.buf.normalize,
      this.m.buf.stride,
      this.m.buf.offset,
    );
  }

  setupViewPort() {
    // Tell WebGL how to convert from clip space to pixels
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    // Clear the canvas
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }
}
