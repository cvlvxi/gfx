import { gl } from "./lib/globals";
import TriangleModel from "./triangle";
import Axis from "./axis";
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

async function main(models: Model[]) {
  while (true) {
    let timeMs: number = await nextFrame();
    for (let m of models) {
      await m.frame();
    }
  }
}

let models = [
  new TriangleModel(gl),
  new Axis(gl),
];

registerEvents(gl, models[0]);
main(models);
