import GfxPipeline from "./pipeline.js";

let canvas: HTMLCanvasElement = document.querySelector("#canvas")
let gl: WebGL2RenderingContext = canvas.getContext("webgl2")
if(!gl) {
    console.log("Could not find gl")
}

console.log("Making Pipeline")
let gfxPipeline = new GfxPipeline(gl)
console.log("Done!")