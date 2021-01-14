import { gl } from "./lib/globals";
import TriangleModel from "./triangle";
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

registerEvents(gl);
let m = new TriangleModel({ gl: gl });
m.draw();
