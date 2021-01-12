import Graph from "./graph";
import { canvas, ctx, nextFrame } from "./globals";

let g = new Graph(canvas, ctx);
window.onresize = () => {
  g.onWindowResize();
};

g.draw();
