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
