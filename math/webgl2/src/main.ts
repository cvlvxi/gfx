import { Buffer, GfxPipeline, Model } from "./pipeline";
import { fragShaderSrc, vertShaderSrc } from "./shaders";
import { gl } from "./globals";

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

let b = new Buffer(gl, positions);
let m = new Model(gl, vertShaderSrc, fragShaderSrc, b);
let gfxPipeline = new GfxPipeline(gl, m);

window.onresize = () => {
  gfxPipeline.onWindowResize();
};

// main(gfxPipeline);
// console.log("Done");
gfxPipeline.draw();
