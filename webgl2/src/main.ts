import { gl } from "./lib/globals";
import TriangleModel from "./triangle";
import { Model } from "./lib/model";
if (!gl) {
  console.log("Could not find gl");
}

async function nextFrame(): Promise<number> {
  return new Promise((resolve, reject) => {
    window.requestAnimationFrame((timeMs) => resolve(timeMs));
  });
}

function registerEvents(gl: WebGL2RenderingContext, m: Model) {
  window.onresize = () => {
    gl.canvas.width = window.innerWidth;
    gl.canvas.height = window.innerHeight;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  };

  window.onkeydown = (e: KeyboardEvent) => {
    m.eventHandling(e);
  };
}

async function main(m: Model) {
  while (true) {
    let timeMs: number = await nextFrame();
    await m.update();
    await m.draw();
  }
}

let m = new TriangleModel(gl, { debug: false });
registerEvents(gl, m);
main(m);
