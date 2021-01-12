import { canvas, ctx } from "./globals";

export function drawAxis() {
  console.log(canvas.width);
  console.log(canvas.height);
  const halfX = canvas.width / 2;
  const halfY = canvas.height / 2;
  // Center
  ctx.translate(canvas.width / 2, canvas.height / 2);

  ctx.font = "10px Arial Narrow";
  ctx.fillText("(0, 0)", 0, 0);

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
