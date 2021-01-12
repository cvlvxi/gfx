import { instrumentGLContext } from "@luma.gl/gltools";
import AppAnimationLoop from "./loop.js";

const canvas = document.getElementById("helloworld");
let gl = instrumentGLContext(canvas.getContext("webgl"));
// Pass the context to the Animation Loop
let animationLoop = new AppAnimationLoop({ gl: gl });
animationLoop.start({ canvas: "helloworld" });
