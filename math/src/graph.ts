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

  draw() {
    ctx.save();
    ctx.lineWidth = 0.1;
    let halfCanvasWidth = canvas.width / 2;
    let halfCanvasHeight = canvas.height / 2;
    ctx.translate(halfCanvasWidth, halfCanvasHeight);
    ctx.scale(
      halfCanvasWidth / this.halfSize,
      halfCanvasHeight / this.halfSize,
    );
    let fontSize = 8 / (halfCanvasHeight / this.halfSize);
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
    let inc: number = this.halfSize / this.numHalfBins;

    let tickAmount = 0.5;
    let currPos = 0;
    for (let i of range(this.numHalfBins)) {
      ctx.beginPath();
      if (!isNeg) {
        currPos += inc;
      } else {
        currPos -= inc;
      }
      if (!isX) {
        ctx.moveTo(-tickAmount, currPos);
        ctx.lineTo(tickAmount, currPos);
        ctx.stroke();
        ctx.fillText(currPos.toFixed(), 0, currPos);
      } else {
        ctx.moveTo(currPos, -tickAmount);
        ctx.lineTo(currPos, tickAmount);
        ctx.stroke();
        ctx.fillText(currPos.toFixed(), currPos, 0);
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
