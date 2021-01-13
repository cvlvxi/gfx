export let canvas: HTMLCanvasElement = document.querySelector("#canvas");
export let gl: WebGL2RenderingContext = canvas.getContext("webgl2");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
gl.enable(gl.DEPTH_TEST);
