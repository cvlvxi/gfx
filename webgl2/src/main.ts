import {
  AttributeDescription,
  ShaderBundle,
  UniformDescription,
} from "./types";
import { Buffer, Model, ModelDrawProperties } from "./model";
import { gl } from "./globals";

var vertexShaderSource = `#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;

uniform mat3 u_matrix;

out vec4 v_color;

// all shaders have a main function
void main() {

  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  // gl_Position = a_position;
  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
  v_color = gl_Position * 0.5 + 0.5;
}
`;

var fragmentShaderSource = `#version 300 es

// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;
in vec4 v_color;

// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
  // Just set the output to a constant redish-purple
  // outColor = vec4(1, 0, 0.5, 1);
  outColor = v_color;
}
`;

if (!gl) {
  console.log("Could not find gl");
}

async function nextFrame(): Promise<number> {
  return new Promise((resolve, reject) => {
    window.requestAnimationFrame((timeMs) => resolve(timeMs));
  });
}

async function main() {
  while (true) {
    let timeMs: number = await nextFrame();
  }
}

function registerEvents(gl: WebGL2RenderingContext) {
  window.onresize = () => {
    gl.canvas.width = window.innerWidth;
    gl.canvas.height = window.innerHeight;
    gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  };

  let xinput = document.getElementById("input_xval") as HTMLInputElement;
  xinput.onchange = () => {
    console.log(xinput.value);
  };
}

let positions = [
  0,
  0,
  0,
  0.5,
  0.7,
  0,
];

let b = new Buffer(gl, new Float32Array(positions));
let apositionDesc: AttributeDescription = {
  size: 2,
  type: gl.FLOAT,
  normalize: false,
  stride: 0,
  offset: 0,
};

let umatrixDesc: UniformDescription = {
  type: "uniformMatrix3fv",
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

let m = new Model(gl, vs, fs, b, modelDrawProperties);
registerEvents(gl);
// main(gfxPipeline);
// gfxPipeline.draw();
m.draw();
m.update();
console.log("Done");
