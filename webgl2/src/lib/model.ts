import {
  AttributeDescription,
  ShaderBundle,
  UniformDescription,
} from "./types";

import { mat3 } from "gl-matrix";

export class Buffer {
  buf: WebGLBuffer | null;
  gl: WebGL2RenderingContext;

  constructor(
    gl: WebGL2RenderingContext,
    data: Float32Array,
    drawType: GLenum = gl.STATIC_DRAW,
  ) {
    this.gl = gl;
    this.buf = gl.createBuffer();
    this.bind();
    gl.bufferData(gl.ARRAY_BUFFER, data, drawType);
  }

  bind() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buf);
  }
}

export interface ModelDrawProperties {
  offset: number;
  count: number;
  primitiveType: GLenum;
}

export interface ModelArgs {
  name?: string;
  gl?: WebGL2RenderingContext;
  vertexBundle: ShaderBundle;
  fragmentBundle: ShaderBundle;
  buf: Buffer;
  drawProperties: ModelDrawProperties;
  debug: boolean;
}

export interface OverwriteModelArgs {
  name?: string;
  gl?: WebGL2RenderingContext;
  vertexBundle?: ShaderBundle;
  fragmentBundle?: ShaderBundle;
  buf?: Buffer;
  drawProperties?: ModelDrawProperties;
  debug?: boolean;
}

export abstract class Model {
  name: string;
  gl: WebGL2RenderingContext;
  vs: ShaderBundle;
  fs: ShaderBundle;
  buf: Buffer;
  drawProperties: ModelDrawProperties;
  debug: boolean;
  program: WebGLProgram | null;
  vao: WebGLVertexArrayObject | null;

  constructor({
    name,
    gl,
    vertexBundle,
    fragmentBundle,
    buf,
    drawProperties,
    debug = false,
  }: ModelArgs) {
    this.name = name;
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

  checkGl(msg: string = "", hardfail: boolean = true) {
    let glErr = this.gl.getError();
    let foundErr = false;
    let errMsg = "";
    switch (glErr) {
      case this.gl.NO_ERROR: {
        errMsg = `No error detected. ${msg}`;
        break;
      }
      case this.gl.INVALID_ENUM: {
        errMsg = `
          An unacceptable value has been specified for an enumerated argument. 
          The command is ignored and the error flag is set. ${msg}`;
        foundErr = true;
        break;
      }
      case this.gl.INVALID_VALUE: {
        errMsg = `A numeric argument is out of range. 
        The command is ignored and the error flag is set. ${msg}`;
        foundErr = true;
        break;
      }
      case this.gl.INVALID_OPERATION: {
        errMsg = `The specified command is not allowed for the current state. 
        The command is ignored and the error flag is set. ${msg}`;
        foundErr = true;
        break;
      }
      case this.gl.INVALID_FRAMEBUFFER_OPERATION: {
        errMsg = `The currently bound framebuffer is not framebuffer complete 
        when trying to render to or to read from it. ${msg}`;
        foundErr = true;
        break;
      }
      case this.gl.OUT_OF_MEMORY: {
        errMsg = `Not enough memory is left to execute the command. ${msg}`;
        foundErr = true;
        break;
      }
      default:
        throw new Error("Unsupported gl error enum found");
        break;
    }
    if (hardfail && foundErr) {
      throw new Error(errMsg);
    }
    if (this.debug || foundErr) {
      console.log(errMsg);
    }
  }

  getUniformLocation(key: string): WebGLUniformLocation {
    let obj: UniformDescription | null = null;
    if (this.vs.uniformMap.has(key)) {
      obj = this.vs.uniformMap.get(key);
    } else if (this.fs.uniformMap.has(key)) {
      obj = this.fs.uniformMap.get(key);
    }
    if (obj === null) {
      throw new Error(
        `Tried to get uniform val for ${key} which doesn't exist`,
      );
    }
    if (!obj.location) {
      throw new Error(
        `Can't ${key} when invalid location in Program`,
      );
    }
    return obj.location;
  }

  createShader(type: number, source: string): WebGLShader | null {
    let shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    this.checkGl("createShader");
    if (this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      return shader;
    }
    console.log(this.gl.getShaderInfoLog(shader));
    this.gl.deleteShader(shader);
  }

  createProgram(): WebGLProgram | undefined {
    let program: WebGLProgram = this.gl.createProgram();
    if (!this.vs.shader) {
      throw new Error(`Failed to compile vertex shader for ${this.name}`);
    }
    if (!this.fs.shader) {
      throw new Error(`Failed to compile fragment shader for ${this.name}`);
    }
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

  abstract update(): void;

  abstract draw(): void;

  abstract eventHandling(input: any): void;

  abstract frame(): void;

  enable() {
    this.gl.useProgram(this.program);
    this.buf.bind();
    this.enableAttributes();
    this.setupVAO();
  }

  enableAttributes() {
    for (let [key, attributeDescription] of this.vs.attributeMap.entries()) {
      this.gl.enableVertexAttribArray(attributeDescription.location);
    }
  }

  setupProgram() {
    this.program = this.createProgram();
    this.vao = this.gl.createVertexArray();
    this.setupViewPort();
    this.enable();
  }

  setupVAO() {
    this.gl.bindVertexArray(this.vao);

    // Enable attributes
    this.enableAttributes();
    for (let attributeDescription of this.vs.attributeMap.values()) {
      if (this.debug) {
        console.log("-".repeat(50));
        console.log(`[${this.name.toUpperCase()} VAO attribute setup]`);
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
    name: string,
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
        let desc: UniformDescription = bundle.uniformMap.get(key);
        desc.location = gl.getUniformLocation(program, key);
        bundle.uniformMap.set(key, desc);
      }
    }
    if (this.debug) {
      console.log("-".repeat(50));
      console.log(
        `[${this.name.toUpperCase()} ${name.toUpperCase()}'s bundle attributes + uniforms]`,
      );
      console.log("[Attribute Map]");
      console.log(bundle.attributeMap);
      console.log("[Uniform Map]");
      console.log(bundle.uniformMap);
    }
  }

  updateShaderBundles(program: WebGLProgram) {
    this.updateShaderBundle(this.gl, program, this.vs, "vertex");
    this.updateShaderBundle(this.gl, program, this.fs, "fragment");
  }
}
