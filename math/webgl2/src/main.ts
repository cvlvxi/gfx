import { Buffer, GfxPipeline, Model, ShaderBundle } from "./pipeline";
import { gl } from "./globals";

var vertexShaderSource = `#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;

// uniform mat3 u_matrix;

out vec4 v_color;

// all shaders have a main function
void main() {

  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  gl_Position = a_position;
  // gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
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

async function main(pipeline: GfxPipeline) {
  while (true) {
    let timeMs: number = await nextFrame();
    pipeline.draw();
  }
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
let vs: ShaderBundle = {
  source: vertexShaderSource,
  attributeMap: new Map([["a_position", null]]),
  // uniformNames: ["u_matrix"],
};
let fs: ShaderBundle = {
  source: fragmentShaderSource,
};

let m = new Model(gl, vs, fs, "a_position", b);
let gfxPipeline = new GfxPipeline(gl, m);

window.onresize = () => {
  gfxPipeline.onWindowResize();
};

main(gfxPipeline);
// gfxPipeline.draw();
console.log("Done");
