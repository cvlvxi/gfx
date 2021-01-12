export let canvas: HTMLCanvasElement = document.getElementById(
  "canvas",
) as HTMLCanvasElement;

export let ctx: CanvasRenderingContext2D = canvas.getContext(
  "2d",
) as CanvasRenderingContext2D;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// canvas.width = 800;
// canvas.height = 600;

console.log(canvas);

export async function nextFrame(): Promise<number> {
  return new Promise((resolve, reject) => {
    window.requestAnimationFrame((timeMs) => resolve(timeMs));
  });
}

export function* range(n: number, inclusive: boolean = false) {
  if (inclusive) {
    n = n + 1;
  }
  for (let i = 0; i < n; ++i) {
    yield i;
  }
}
