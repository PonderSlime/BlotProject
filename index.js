/*
@title: framed_landscape
@author: PonderSlime
@snapshot: the name of the snapshot file you want in the gallery
*/

const canvasWidth = 125;
const canvasHeight = 125;

const frameType = "default"  //The current frames available are: "default", "spiral"
const resX = 5.16
const resY = 0.52


//Cusomization
const isNight = false;
const sunRadius = 5;
const sunRays = 23;
const starCount = bt.randInRange(15, 40);
const starSize =  0.75;

const scale = (bt.randInRange(20, 25) + 0.7);

const lineThickness = 1.5;
const line_spacing = 1.5;
const num1 = bt.randInRange(30, 180);
const num2 = bt.randInRange(30, 180);

const distanceFalloff = 4
const heightScale = 40.9
const seaLevel = 16.6

const noiseScale = bt.randInRange(0.3, 0.5);
const waveHeight = 0.16
//End of Customization


setDocDimensions(canvasWidth, canvasHeight);
const cameraX = 23.54
const time = 106
let lineLength;
const eraseSize = 5 * 25
let drawSize;
const dx = 1 / (resX * 10)
const dy = 1 / (resY * 10)
const xCenter = canvasWidth / 2
const yCenter = canvasHeight / 2
const globalScale = scale
const waveScale = noiseScale * 27.55 * Math.sin(time * 0.1)
let maxHeights = Array(Math.floor(10 / dx)).fill(0)

const t = new bt.Turtle();
const t2 = new bt.Turtle();

const finalLines = [];
const borderLines = [];

let turn1 = 0;
let turn2 = 0;
if (frameType == "default") {
  turn1 = 34;
  turn2 = 90;
  drawSize = 2.0456 * scale;
  lineLength = 2.5 * scale
}
else if (frameType == "ribbon") {
  turn1 = 34;
  turn2 = 83;
  drawSize = 2.206 * scale
  lineLength = 2.4 * scale
}

const createShape = (turtle, n, size) => {
  const turnAngle = 360 / n;
  for (let i = 0; i < n; i++) {
    turtle.forward(size);
    turtle.left(turnAngle);
  }
}
const createLines = (canvasWidth, canvasHeight) => {
  const t = new bt.Turtle();
  for (let i = 0; i < canvasHeight; i++) {
    t.forward(lineLength);
    t.up();
    t.left(turn1);
    t.forward(lineLength);
    t.left(turn2);
    t.forward(lineLength);
    t.left(turn1);
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
function sunRaycast() {
  if (!isNight) {
    t2.jump([(canvasWidth / 2) - sunRadius * 2, canvasHeight / 2]).setAngle(270).down().arc(360, sunRadius); // circle
    for (let i = 1; i < sunRays + 1; i++) {
      let angle = -i / (sunRays + 1) * 380;
      let distance = i % 2 == 1 ? 11 : 9;
      t2.jump([canvasWidth / 2 , canvasHeight / 2]).setAngle(270).down().arc(angle, sunRadius); // go to pos
      t2.setAngle(angle).up().forward(0.2).down().forward(distance); // sun ray
    }
  }
}

let stars = [];
if (isNight) {
  for (let i = 0; i < starCount; i++) {
    const xCenter = (0.9*Math.random()+0.05)*canvasWidth;
    const yCenter = (0.9*Math.random()+0.05)*canvasHeight/1.75+canvasHeight/2.5;
    const randomSize = 1.5*Math.random() + 0.5;
    if (Math.min(drawSize) < randomSize * starSize){
      continue // Star is too close to moon or sun. It would be covered, so don't draw it.
    }
    let star = [
      [xCenter+starSize*randomSize,yCenter],
      [xCenter+starSize*randomSize*0.2,yCenter+starSize*randomSize*0.2],
      [xCenter,yCenter+starSize*randomSize],
      [xCenter-starSize*randomSize*0.2,yCenter+starSize*randomSize*0.2],
      [xCenter-starSize*randomSize,yCenter],
      [xCenter-starSize*randomSize*0.2,yCenter-starSize*randomSize*0.2],
      [xCenter,yCenter-starSize*randomSize],
      [xCenter+starSize*randomSize*0.2,yCenter-starSize*randomSize*0.2],
      [xCenter+starSize*randomSize,yCenter]]
      stars.push(star);
    
  }
}
drawLandscape()
sunRaycast()
const lines = createLines(canvasWidth, canvasHeight);

bt.scale(t.path, canvasWidth / bt.bounds(t.path).width);
bt.translate(t.path, [canvasWidth / 2, -24], bt.bounds(t.path).cb);
//bt.translate(sun, [canvasWidth / 2, 0], [canvasWidth - canvasWidth / 3 * scale / 4 + 175, 0 - canvasHeight / 4 * scale / 20]);
bt.translate(t2.path, [canvasWidth / 2, 0], [canvasWidth - canvasWidth / 3 * scale / 4 + 175 - sunRadius, 0 - canvasHeight / 4 * scale / 20]);
bt.translate(lines, [canvasWidth / 2, canvasHeight / 2], bt.bounds(lines).cc);

drawLines(stars, { stroke: "black", fill: "none" });

const subjectPolylines = [eraseCircle];
const clippingPolylines = [drawCircle];
bt.difference(subjectPolylines, clippingPolylines);
bt.join(borderLines, subjectPolylines);
drawLines(t.path, { stroke: "black", fill: "white" });
drawLines(t2.path, { stroke: "black", fill: "white" });
drawLines(borderLines, { stroke: "none", fill: "white" });
drawLines(lines);