import {
  AttributeDescription,
  ShaderBundle,
  UniformDescription,
} from "./lib/types";
import {
  Buffer,
  Model,
  ModelArgs,
  ModelDrawProperties,
  OverwriteModelArgs,
} from "./lib/model";

import { mat3 } from "gl-matrix";

var vertexShaderSource = `#version 300 es
in vec2 a_position;

uniform mat3 u_matrix;

out vec4 v_color;

void main() {
  // Multiply the position by the matrix.
  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);

  // Convert from clipspace to colorspace.
  // Clipspace goes -1.0 to +1.0
  // Colorspace goes from 0.0 to 1.0
  v_color = gl_Position * 0.5 + 0.5;
}
`;

var fragmentShaderSource = `#version 300 es

precision highp float;

in vec4 v_color;

out vec4 outColor;

void main() {
  outColor = v_color;
}
`;

let positions = [
  0,
  0,
  0,
  0.5,
  0.7,
  0,
];

function setup(gl: WebGL2RenderingContext): ModelArgs {
  let b = new Buffer(gl, new Float32Array(positions));
  let apositionDesc: AttributeDescription = {
    size: 2,
    type: gl.FLOAT,
    normalize: false,
    stride: 0,
    offset: 0,
  };

  let umatrixDesc: UniformDescription = {
    func: gl.uniformMatrix3fv,
    matrix: true,
  };
  let vs: ShaderBundle = {
    source: vertexShaderSource,
    attributeMap: new Map([["a_position", apositionDesc]]),
    uniformMap: new Map([["u_matrix", umatrixDesc]]),
  };

  let fs: ShaderBundle = {
    source: fragmentShaderSource,
  };

  let modelDrawProperties: ModelDrawProperties = {
    offset: 0,
    count: 3,
    primitiveType: gl.TRIANGLES,
  };

  return {
    name: "triangle",
    buf: b,
    debug: false,
    drawProperties: modelDrawProperties,
    fragmentBundle: fs,
    vertexBundle: vs,
  };
}

export default class TriangleModel extends Model {
  constructor(gl: WebGL2RenderingContext, args?: OverwriteModelArgs) {
    let defaultArgs: ModelArgs = setup(gl);
    let newArgs: OverwriteModelArgs & ModelArgs = { gl: gl, ...defaultArgs };
    if (args) {
      newArgs = { gl: gl, ...defaultArgs, ...args };
    }
    super(newArgs);
  }

  async update() {
    let matrix = mat3.create();
    mat3.identity(matrix);
    let location = this.getUniformLocation("u_matrix");
    this.gl.uniformMatrix3fv(location, false, matrix);
  }

  async draw() {
    this.gl.drawArrays(
      this.drawProperties.primitiveType,
      this.drawProperties.offset,
      this.drawProperties.count,
    );
  }
}
