import { AttributeDescription, ShaderBundle } from "./types";

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

  constructor(
    gl: WebGL2RenderingContext,
    vertexBundle: ShaderBundle,
    fragmentBundle: ShaderBundle,
    buf: Buffer,
    drawProperties: ModelDrawProperties,
  ) {
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

  updateShaderBundleIdxMap(
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
        bundle.uniformMap.set(key, gl.getUniformLocation(program, key));
      }
    }
  }

  updateShaderBundleIdxMaps(program: WebGLProgram) {
    this.updateShaderBundleIdxMap(this.gl, program, this.vs);
    this.updateShaderBundleIdxMap(this.gl, program, this.fs);
  }
}
