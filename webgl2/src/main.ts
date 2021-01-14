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

function registerEvents(gl: WebGL2RenderingContext) {
  window.onresize = () => {
    gl.canvas.width = window.innerWidth;
    gl.canvas.height = window.innerHeight;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  };

  let xinput = document.getElementById("input_xval") as HTMLInputElement;
  xinput.onchange = () => {
    console.log(xinput.value);
  };
}

async function main(m: Model) {
  while (true) {
    let timeMs: number = await nextFrame();
    await m.update();
    await m.draw();
  }
}

registerEvents(gl);
let m = new TriangleModel(gl, { debug: false });
main(m);
