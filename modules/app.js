// import { el } from "./helpers";

import { Canvas } from "./canvas.js";
import { Rectangle } from "./block.js";

window.canvasScale = 0.5;

const canvas = new Canvas(
  ".drawingCanvas",
  document.body,
  window.innerWidth ,
  window.innerHeight 
);

canvas.canvasElem.tabIndex = 1;
// canvas.focus(); 

canvas.x = 0;
canvas.y = 0;

const rect = new Rectangle(150, 150, 150, 300, canvas, ".block");
rect.init();
// // rect.draw();

// const rect1 = new Rectangle(350, 150, 150, 300, canvas, '.block');
// rect1.init();
// rect1.draw();
canvas.context.scale(canvasScale, canvasScale);

canvas.render();
