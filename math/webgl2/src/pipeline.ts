export class Buffer {
  buf: WebGLBuffer | null;
  drawType: GLenum;
  vertexCount: number;
  type: GLenum;
  normalize: boolean;
  stride: number;
  offset: number;

  constructor(
    gl: WebGL2RenderingContext,
    data: number[],
    dataType: GLenum = gl.FLOAT,
    vertexCount: number = 2, // 2 components per iteration
    drawType: GLenum = gl.STATIC_DRAW,
    normalize: boolean = false,
    stride: number = 0, // move forward size * sizeof(type) each iteration
    offset: number = 0, // start at beginning of buffer
  ) {
    this.buf = gl.createBuffer();
    this.drawType = drawType;
    let arr: Float32Array;
    if (dataType == gl.FLOAT) {
      arr = new Float32Array(data);
    } else {
      throw new Error("Cannot handle dataType");
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
    gl.bufferData(gl.ARRAY_BUFFER, arr, this.drawType);
    this.normalize = normalize;
    this.stride = stride;
    this.offset = offset;
  }
}

export class Model {
  gl: WebGL2RenderingContext;
  vs: WebGLShader;
  fs: WebGLShader;
  positionAttributeName: string;
  buf: Buffer;

  constructor(
    gl: WebGL2RenderingContext,
    vertexSrc: string,
    fragSrc: string,
    buf: Buffer,
    positionAttributeName: string = "a_position",
  ) {
    this.gl = gl;
    this.vs = this.createShader(gl.VERTEX_SHADER, vertexSrc);
    this.fs = this.createShader(gl.FRAGMENT_SHADER, fragSrc);
    this.positionAttributeName = positionAttributeName;
    this.buf = buf;
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
}

export class GfxPipeline {
  gl: WebGL2RenderingContext;
  m: Model;
  program: WebGLProgram | null;
  positionAttribIndex: GLuint;
  vao: WebGLVertexArrayObject | null;

  constructor(gl: WebGL2RenderingContext, m: Model) {
    this.gl = gl;
    this.m = m;
    this.setup();
  }

  createProgram(model: Model): WebGLProgram | undefined {
    let program: WebGLProgram = this.gl.createProgram();
    this.gl.attachShader(program, model.vs);
    this.gl.attachShader(program, model.fs);
    this.gl.linkProgram(program);
    this.positionAttribIndex = this.gl.getAttribLocation(
      program,
      model.positionAttributeName,
    );
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
  }

  setup() {
    this.program = this.createProgram(this.m);
    // Enable the model's positionAttribIndex
    this.setupAttributes();
    this.setupView();
    this.gl.useProgram(this.program);
    this.gl.bindVertexArray(this.vao);
  }

  setupAttributes() {
    console.log(this.m.buf);
    this.vao = this.gl.createVertexArray();
    this.gl.bindVertexArray(this.vao);
    this.gl.enableVertexAttribArray(this.positionAttribIndex);
    this.gl.vertexAttribPointer(
      this.positionAttribIndex,
      this.m.buf.vertexCount,
      this.m.buf.type,
      this.m.buf.normalize,
      this.m.buf.stride,
      this.m.buf.offset,
    );
  }

  setupView() {
    // Tell WebGL how to convert from clip space to pixels
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    // Clear the canvas
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }
}
