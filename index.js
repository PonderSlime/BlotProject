/*
@title: framed_landscape
@author: PonderSlime
@snapshot: the name of the snapshot file you want in the gallery
*/

const canvasWidth = 125;
const canvasHeight = 125;
const time = 106

const resX = 5.16
const resY = 0.52

const cameraX = 23.54

const lineThickness = 1.5;
const line_spacing = 1.5;
const num1 = bt.randInRange(30, 180);
const num2 = bt.randInRange(30, 180);
const scale = (bt.randInRange(20, 25) + 0.7);
const lineLength = 2.5 * scale
const eraseSize = 5 * 25
const drawSize = 2.0456 * scale
const distanceFalloff = 4
const heightScale = 40.9
const noiseScale = bt.randInRange(0.3, 0.5);
const seaLevel = 16.6
const waveScale = noiseScale * 27.55 * Math.sin(time * 0.1)
const waveHeight = 0.16
const globalScale = scale

const dx = 1 / (resX * 10)
const dy = 1 / (resY * 10)

setDocDimensions(canvasWidth, canvasHeight);
let maxHeights = Array(Math.floor(10 / dx)).fill(0)

const t = new bt.Turtle();

const finalLines = [];
const borderLines = [];
const finalLinesBounds = bt.bounds(finalLines);

const createShape = (turtle, n, size) => {
  const turnAngle = 360 / n;
  for (let i = 0; i < n; i++) {
    turtle.forward(size);
    turtle.left(turnAngle);
  }
};
const createLines = (canvasWidth, canvasHeight) => {
  const t = new bt.Turtle();
  for (let i = 0; i < canvasHeight; i++) {
    t.forward(lineLength);
    t.up();
    t.left(34);
    t.forward(lineLength);
    t.left(90);
    t.forward(lineLength);
    t.left(34);
    t.down();
  }
  return t.lines();
}

function go(x, y) {
  t.goTo([x * globalScale, (y - 8) * globalScale])
}
// Generate a list of points that forms the circle for the border
let eraseCircle = [];
let drawCircle = [];

for (let i = 0; i < lineLength; i++) {
  eraseCircle.push([canvasWidth / 2 + eraseSize * Math.cos(2 * Math.PI * i / lineLength), canvasHeight / 2 + eraseSize * Math.sin(2 * Math.PI * i / lineLength)]);
  drawCircle.push([canvasWidth / 2 + drawSize * Math.cos(2 * Math.PI * i / lineLength), canvasHeight / 2 + drawSize * Math.sin(2 * Math.PI * i / lineLength)]);
}

function genHeight(x, y) {
  let height =
    (bt.noise([x * noiseScale + cameraX, Math.pow(y, 1.4) * noiseScale]) *
      heightScale) /
    (y + distanceFalloff)
  height = Math.max(
    height,
    (seaLevel + waveHeight * Math.sin(x * waveScale + Math.cos(y * 25.0))) /
    (y + 4)
  )
  return height
}

function drawLandscape() {
  for (let y = 0; y < +10; y += dy) {
    for (let x = 0; x < 10; x += dx) {
      let height = (4 * genHeight(x, y)) / 6.56
      if (x > 0) {
        t.down()
      } else {
        t.up()
      }
      if (height + y / 2 >= maxHeights[Math.floor(x / dx)]) {
        go(x, y / 2 + height)
        maxHeights[Math.floor(x / dx)] = height + y / 2
      } else {
        t.up()
        go(x, y / 2 + height)
      }
    }

    t.up()
    go(0, 0)
  }
}

drawLandscape()
const lines = createLines(canvasWidth, canvasHeight);
bt.scale(t.path, canvasWidth / bt.bounds(t.path).width);
bt.translate(t.path, [canvasWidth / 2, -24], bt.bounds(t.path).cb);
bt.translate(lines, [canvasWidth / 2, canvasHeight / 2], bt.bounds(lines).cc);

bt.join(finalLines, t.path);




drawLines(finalLines);
const subjectPolylines = [eraseCircle];
const clippingPolylines = [drawCircle];
bt.difference(subjectPolylines, clippingPolylines);
bt.join(borderLines, subjectPolylines);
drawLines(borderLines, { stroke: "none", fill: "white" });
drawLines(lines);