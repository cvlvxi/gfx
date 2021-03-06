import * as types from "./lib/types";
import * as model from "./lib/model";
import { mat3 } from "gl-matrix";

function setup(gl: WebGL2RenderingContext): model.ModelArgs {
  let vertexShaderSource = `#version 300 es
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

  let fragmentShaderSource = `#version 300 es
  
  precision highp float;
  
  in vec4 v_color;
  
  out vec4 outColor;
  
  void main() {
    outColor = v_color;
  }
  `;

  let positions = [
    0,
    100,
    100,
    -100,
    -100,
    -100,
  ];
  let b = new model.Buffer(gl, new Float32Array(positions));
  let apositionDesc: types.AttributeDescription = {
    size: 2,
    type: gl.FLOAT,
    normalize: false,
    stride: 0,
    offset: 0,
    buf: b,
  };

  let umatrixDesc: types.UniformDescription = {
    func: gl.uniformMatrix3fv,
    matrix: true,
  };
  let vs: types.ShaderBundle = {
    source: vertexShaderSource,
    attributeMap: new Map([["a_position", apositionDesc]]),
    uniformMap: new Map([["u_matrix", umatrixDesc]]),
  };

  let fs: types.ShaderBundle = {
    source: fragmentShaderSource,
  };

  let modelDrawProperties: model.ModelDrawProperties = {
    offset: 0,
    count: 3,
    primitiveType: gl.TRIANGLES,
  };

  return {
    name: "triangle",
    debug: false,
    drawProperties: modelDrawProperties,
    fragmentBundle: fs,
    vertexBundle: vs,
  };
}

export default class Triangle extends model.Model {
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
    mat3.translate(
      this.matrix,
      this.matrix,
      [this.gl.canvas.width / 2, this.gl.canvas.height / 2],
    );
    mat3.scale(this.matrix, this.matrix, [1, -1]);
  }

  async update() {
    let location = this.getUniformLocation("u_matrix");
    this.gl.uniformMatrix3fv(location, false, this.matrix);
  }

  async draw() {
    this.gl.drawArrays(
      this.drawProperties.primitiveType,
      this.drawProperties.offset,
      this.drawProperties.count,
    );
  }

  async eventHandling(input: any) {
    const TRANSLATE_AMOUNT = 100;
    let keyEvent = input as KeyboardEvent;
    let translate: boolean = false;
    let dx: number = 0;
    let dy: number = 0;
    switch (keyEvent.code) {
      case "KeyW": {
        dy = TRANSLATE_AMOUNT;
        break;
      }
      case "KeyS": {
        dy = -TRANSLATE_AMOUNT;
        break;
      }
      case "KeyD": {
        dx = TRANSLATE_AMOUNT;
        break;
      }
      case "KeyA": {
        dx = -TRANSLATE_AMOUNT;
        break;
      }
      default:
        break;
    }
    mat3.translate(this.matrix, this.matrix, [dx, dy]);
  }

  async frame() {
    this.enable();
    await this.update();
    await this.draw();
  }
}
