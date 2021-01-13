export let canvas: HTMLCanvasElement = document.querySelector("#canvas");
export let gl: WebGL2RenderingContext = canvas.getContext("webgl2");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
gl.enable(gl.DEPTH_TEST);

export function checkGl() {
    let glErr = gl.getError()
    switch(glErr) {
        case gl.NO_ERROR
    }
}