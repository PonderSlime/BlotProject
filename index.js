/*@title: spiral_pattern
@author: PonderSlime
@snapshot: the name of the snapshot file you want in the gallery
*/

const canvasWidth = 125;
const canvasHeight = 125;
const time = 106

const resX = 5.16
const resY = 0.52

const cameraX = 23.54

const globalScale = 1
const center = canvasWidth / 2;

const lineThickness = 1.5;
const line_spacing = 1.5;
const num1 = bt.randInRange(30, 180);
const num2 = bt.randInRange(30, 180);
const scale = (bt.randInRange(20, 25) + 0.7);
const lineLength = 2.5 * scale
const eraseSize = 5 * scale
const drawSize = 2.41// * scale
const distanceFalloff = 4
const heightScale = 40.9
const noiseScale = 0.3
const seaLevel = 16.6
const waveScale = noiseScale * 27.55 * Math.sin(time * 0.1)
const waveHeight = 0.16
const divise = bt.rand() * .04 + 1.4

const dx = 1 / (resX * 10)
const dy = 1 / (resY * 10)

setDocDimensions(canvasWidth, canvasHeight);
let maxHeights = Array(Math.floor(10 / dx)).fill(0)

const t = new bt.Turtle();

const finalLines = [];
const borderLines = [];
const finalLinesBounds = bt.bounds(finalLines);

const createShape = (turtle, n, size) => {  
  const turnAngle = 360 / n;  for (let i = 0; i < n; i++) {
    turtle.forward(size);
    turtle.left(turnAngle);  }};
const drawCircle = [
  bt.nurbs([
    [center + drawSize, 0 + center],
    [center + drawSize / divise, drawSize / divise + center],
    [center, 0 + drawSize / divise + center],
    [center - drawSize / divise, drawSize / divise + center],
    [center + -drawSize / divise, 0 + center],
    [center - drawSize / divise, -drawSize / divise + center],
    [center, 0 - drawSize / divise + center],
    [center + drawSize / divise, -drawSize / divise+ center],
    [center + drawSize, 0 + center]
  ])
]

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
  //height *= softmin(y, 1.0)
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
//const eraseCircle = createCircle(360, eraseSize);
bt.scale(t.path, canvasWidth/bt.bounds(t.path).width);
bt.translate(t.path, [canvasWidth/2, -24], bt.bounds(t.path).cb);
bt.translate(lines, [canvasWidth / 2, canvasHeight / 2], bt.bounds(lines).cc);
//drawLines([eraseCircle], { stroke: "none", fill: "black" });
//drawLines([drawCircle], { stroke: "none", fill: "white" });
bt.join(finalLines, lines);
bt.join(finalLines, t.path);
//bt.join(borderLines, eraseCircle);
//bt.join(borderLines, drawCircle);
drawLines(drawCircle, { fill: "#FCE9BB", stroke: "#FCE9BB" });


drawLines(finalLines);
//drawLines([borderLines]);