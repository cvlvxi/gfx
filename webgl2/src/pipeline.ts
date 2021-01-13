import { Model } from "./model";
import { AttributeDescription } from "./types";

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

  createProgram(model: Model): WebGLProgram | undefined {
    let program: WebGLProgram = this.gl.createProgram();
    this.gl.attachShader(program, model.vs.shader);
    this.gl.attachShader(program, model.fs.shader);
    this.gl.linkProgram(program);

    // Check link status
    const linked = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
    if (!linked) {
      throw new Error("Program not linked");
    }

    // Update Indexes
    this.m.updateShaderBundles(program);

    if (this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      return program;
    }
    console.log(this.gl.getProgramInfoLog(program));
    this.gl.deleteProgram(program);
  }

  draw() {
    this.m.draw();
  }

  update() {
    this.m.update();
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

    // Enable attributes
    this.m.enableAttributes();
    for (let attributeDescription of this.m.vs.attributeMap.values()) {
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

  setupViewPort() {
    // Tell WebGL how to convert from clip space to pixels
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    // Clear the canvas
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }
}
