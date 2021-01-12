import { canvas, ctx, range } from "./globals";

interface Coord {
  x: number;
  y: number;
}

export default class Graph {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  halfSize: number = 50;
  zoom: number = 1;
  numHalfBins: number = 10;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.canvas = canvas;
  }

  onWindowResize() {
    // Modify the canvas width and height
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.draw();
  }

  get scale(): number {
    // Maybe pick the min of width and height
    // Just use one scale rather than two seperates ones since
    // aspect ratio can make things wonky
    return this.canvas.width / 2 / this.halfSize;
  }

  draw() {
    ctx.save();
    ctx.lineWidth = 2;
    let halfCanvasWidth = canvas.width / 2;
    let halfCanvasHeight = canvas.height / 2;
    ctx.translate(halfCanvasWidth, halfCanvasHeight);
    let fontSize = 12;
    ctx.font = `${fontSize}px sans-serif`;
    this.drawAxis();
    this.drawTick(true, true);
    this.drawTick(false, true);
    this.drawTick(true, false);
    this.drawTick(false, false);

    ctx.restore();
  }

  drawTick(isNeg: boolean = false, isX: boolean = true) {
    // Draw the ticks
    let inc: number = (this.halfSize / this.numHalfBins);

    let tickAmount = 5;
    let currPosStr: number | null = null;
    for (let i of range(this.numHalfBins)) {
      ctx.beginPath();
      let currPos: number = i * inc;
      let currPosStr = currPos;
      currPos = currPos * this.scale;
      if (isNeg) {
        currPos = currPos * -1;
      }
      console.log(currPos);

      if (!isX) {
        ctx.moveTo(
          -tickAmount,
          currPos,
        );
        ctx.lineTo(
          tickAmount,
          currPos,
        );
        ctx.stroke();
        ctx.fillText(currPosStr.toFixed(), 4, currPos);
      } else {
        ctx.moveTo(
          currPos,
          -tickAmount,
        );
        ctx.lineTo(
          currPos,
          tickAmount,
        );
        ctx.stroke();
        ctx.fillText(currPosStr.toFixed(), currPos, -5);
      }
    }
  }

  drawAxis() {
    const halfX = canvas.width / 2;
    const halfY = canvas.height / 2;

    // X Axis
    ctx.beginPath();
    ctx.moveTo(-halfX, 0);
    ctx.lineTo(halfX, 0);
    ctx.stroke();

    // Y Axis
    ctx.beginPath();
    ctx.moveTo(0, -halfY);
    ctx.lineTo(0, halfY);
    ctx.stroke();
  }
}
