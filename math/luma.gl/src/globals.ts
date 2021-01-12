// @ts-ignore
import { instrumentGLContext } from "@luma.gl/gltools";

export let canvas: HTMLCanvasElement = document.getElementById("canvas");
export let gl: WebGL2RenderingContext = instrumentGLContext(
  canvas.getContext("webgl"),
);
