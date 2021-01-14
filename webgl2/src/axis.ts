import * as types from "./lib/types";
import * as model from "./lib/model";
import { mat3 } from "gl-matrix";

function setup(gl: WebGL2RenderingContext): model.ModelArgs {
  let vertexShaderSource = `#version 300 es
in vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0, 1);
}
`;

  let fragmentShaderSource = `#version 300 es

  precision highp float;
out vec4 outColor;

void main() {
  outColor = vec4(0,0,0,1);
}
`;

  let positions = [
    -gl.canvas.width,
    0,
    gl.canvas.width,
    0,
  ];

  let b = new model.Buffer(gl, new Float32Array(positions));
  let apositionDesc: types.AttributeDescription = {
    size: 2,
    type: gl.FLOAT,
    normalize: false,
    stride: 0,
    offset: 0,
  };

  let umatrixDesc: types.UniformDescription = {
    func: gl.uniformMatrix3fv,
    matrix: true,
  };
  let vs: types.ShaderBundle = {
    source: vertexShaderSource,
    attributeMap: new Map([["a_position", apositionDesc]]),
  };

  let fs: types.ShaderBundle = {
    source: fragmentShaderSource,
  };

  let modelDrawProperties: model.ModelDrawProperties = {
    offset: 0,
    count: positions.length / 2,
    primitiveType: gl.LINES,
  };

  return {
    name: "axis",
    buf: b,
    debug: false,
    drawProperties: modelDrawProperties,
    fragmentBundle: fs,
    vertexBundle: vs,
  };
}

export default class AxisModel extends model.Model {
  matrix: mat3;

  constructor(gl: WebGL2RenderingContext, args?: model.OverwriteModelArgs) {
    let defaultArgs: model.ModelArgs = setup(gl);
    let newArgs: model.OverwriteModelArgs & model.ModelArgs = {
      gl: gl,
      ...defaultArgs,
    };
    if (args) {
      newArgs = { gl: gl, ...defaultArgs, ...args };
    }
    super(newArgs);
    this.matrix = mat3.create();
    mat3.projection(this.matrix, this.gl.canvas.width, this.gl.canvas.height);
  }

  async update() {
  }

  async draw() {
    this.gl.drawArrays(
      this.drawProperties.primitiveType,
      this.drawProperties.offset,
      this.drawProperties.count,
    );
  }

  async eventHandling(input: any) {
  }

  async frame() {
    this.enable();
    await this.update();
    await this.draw();
  }
}
