/************************* Setup function p5.js to create canvas  ******************************/

function setup() {
  canvas = createCanvas(720, 560);
  canvas.id("canvas")
  selectCanvas = select("#canvas")
}

/************************* draw function p5.js to draw  ******************************/

function draw() {
  clear();
  makeBoxes();
}

