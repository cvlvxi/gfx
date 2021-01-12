export let canvas: HTMLCanvasElement = document.getElementById(
  "canvas",
) as HTMLCanvasElement;

export let ctx: CanvasRenderingContext2D = canvas.getContext(
  "2d",
) as CanvasRenderingContext2D;

ctx.lineWidth = 20;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
