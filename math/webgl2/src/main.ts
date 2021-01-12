import { Buffer, GfxPipeline, Model } from "./pipeline";
import { gl } from "./globals";

var vertexShaderSource = `#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;

// all shaders have a main function
void main() {

  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  gl_Position = a_position;
}
`;

var fragmentShaderSource = `#version 300 es

// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;

// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
  // Just set the output to a constant redish-purple
  outColor = vec4(1, 0, 0.5, 1);
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
let m = new Model(gl, vertexShaderSource, fragmentShaderSource, b);
let gfxPipeline = new GfxPipeline(gl, m);

window.onresize = () => {
  gfxPipeline.onWindowResize();
};

// main(gfxPipeline);
gfxPipeline.draw();
console.log("Done");
