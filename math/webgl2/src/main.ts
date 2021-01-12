import GfxPipeline from "./pipeline";
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

let gfxPipeline = new GfxPipeline(gl);

window.onresize = () => {
  gfxPipeline.onWindowResize();
};

main(gfxPipeline);
console.log("Done");
