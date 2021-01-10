import GfxPipeline from "./pipeline.js";

let canvas: HTMLCanvasElement = document.querySelector("#canvas");
let gl: WebGL2RenderingContext = canvas.getContext("webgl2");
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

gl.enable(gl.DEPTH_TEST);
let gfxPipeline = new GfxPipeline(gl);
main(gfxPipeline);
console.log("Done");
