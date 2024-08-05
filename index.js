/*
@title: framed_landscape
@author: PonderSlime
@snapshot: the name of the snapshot file you want in the gallery
*/

const canvasWidth = 125;
const canvasHeight = 125;

const frameType = "default"  //The current frames available are: "default", "ribbon"
const resX = 5.16
const resY = 0.52


//Cusomization
const isNight = false;
const isCloudy = true;
const sunMoonRadius = 5;
const sunRays = 23;
const moonClipOffsetX = 0.5;
const moonClipOffsetY = -0.4;
const starCount = bt.randInRange(15, 40);
const starSize =  0.75;
const cloudSize =  1;
const cloudCount = 20;

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
const sun = new bt.Turtle();
const moon = new bt.Turtle();
const t4 = new bt.Turtle();

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
  for (let i = 0; i < canvasHeight / 1.5; i++) {
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
let sunCircle = [];
let moonCircle = [];

function drawSun() {
  if (!isNight) {
    sun.jump([(canvasWidth / 2) - sunMoonRadius * 2, canvasHeight / 2]).setAngle(270).down().arc(360, sunMoonRadius); // circle
    for (let i = 1; i < sunRays + 1; i++) {
      let angle = -i / (sunRays + 1) * 380;
      let distance = i % 2 == 1 ? 11 : 9;
      sun.jump([canvasWidth / 2 , canvasHeight / 2]).setAngle(270).down().arc(angle, sunMoonRadius); // go to pos
      sun.setAngle(angle).up().forward(0.2).down().forward(distance); // sun ray
    }
  };
  if (isNight) { 
    for (let i = 0; i < lineLength; i++) {
    sunCircle.push([canvasWidth / 2 + (sunMoonRadius) * Math.cos(2 * Math.PI * i / lineLength), canvasHeight / 2 + (sunMoonRadius) * Math.sin(2 * Math.PI * i / lineLength)]);
    moonCircle.push([canvasWidth / 2 + (moonClipOffsetX) + (sunMoonRadius) * Math.cos(2 * Math.PI * i / lineLength), canvasHeight / 2 + (moonClipOffsetY) + (sunMoonRadius) * Math.sin(2 * Math.PI * i / lineLength)]);
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

    

if (isCloudy) {
  for (let i = 0; i < cloudCount; i++) {
    const xCenter = (0.9*Math.random()+0.05)*canvasWidth;
    const yCenter = (0.9*Math.random()+0.05)*canvasHeight/1.75+canvasHeight/2.5;
    const randomSize = (1.5*Math.random() + 1) * (cloudSize)*0.15;
    let cloudType = Math.floor(Math.random() * 2)
      ;
    if (Math.min(drawSize) < randomSize * (cloudSize * 0.1)){
      continue // Star is too close to moon or sun. It would be covered, so don't draw it.
    }
    if (cloudType == 0) {
      cloudType = 1
    }
    if (cloudType == 1) {
      t4.jump([xCenter,yCenter])
      t4.down();
      t4.setAngle(0);
      t4.forward(47.54 * randomSize);
      t4.arc(103, 7 * randomSize);
      t4.setAngle(102);
      t4.arc(86, 8 * randomSize);
      t4.setAngle(-93);
      t4.arc(125, -9 * randomSize);
      t4.setAngle(172);
      t4.arc(28, 23 * randomSize);
      t4.setAngle(145);
      t4.arc(113, 15 * randomSize);
      t4.setAngle(215);
      t4.arc(28, 7 * randomSize);
      t4.arc(106, 7 * randomSize);
    }
    else if (cloudType == 2) {
      t4.jump([xCenter,yCenter])
      t4.down();
      t4.setAngle(0);
      t4.forward(36.28 * randomSize);
      t4.arc(110, 8 * randomSize);
      t4.setAngle(102);
      t4.arc(48, 10 * randomSize);
      t4.setAngle(75);
      t4.arc(121, 6* randomSize);
      t4.setAngle(90);
      t4.arc(125, 8 * randomSize);
      t4.setAngle(136);
      t4.arc(127, 8* randomSize);
      t4.setAngle(160);
      t4.arc(127, 10* randomSize);
      t4.setAngle(235.55);
      t4.arc(124.96, 9* randomSize);
    }
  }
}
drawLandscape()
drawSun()
const lines = createLines(canvasWidth, canvasHeight);
const sunPolylines = [sunCircle];
const moonPolylines = [moonCircle];

bt.scale(t.path, canvasWidth / bt.bounds(t.path).width);
bt.translate(t.path, [canvasWidth / 2, -24], bt.bounds(t.path).cb);
bt.translate(sun.path, [canvasWidth / 2, 0], [canvasWidth - canvasWidth / 3 * scale / 4 + 175, 0 - canvasHeight / 4 * scale / 20]);
bt.translate(sunPolylines, [canvasWidth / 2, 0], [canvasWidth - canvasWidth / 3 * scale / 4 + 175 - sunMoonRadius, 0 - canvasHeight / 4 * scale / 20]);
bt.translate(moonPolylines, [canvasWidth / 2 + 2, 0 - 1], [canvasWidth - canvasWidth / 3 * scale / 4 + 175 - sunMoonRadius, 0 - canvasHeight / 4 * scale / 20]);


bt.translate(lines, [canvasWidth / 2, canvasHeight / 2], bt.bounds(lines).cc);

drawLines(stars, { stroke: "black", fill: "white" });

drawLines(t.path, { stroke: "black", fill: "white" });

bt.difference(sunPolylines, moonPolylines);
drawLines(sunPolylines, { stroke: "black", fill: "white" });

const subjectPolylines = [eraseCircle];
const clippingPolylines = [drawCircle];
bt.difference(subjectPolylines, clippingPolylines);
drawLines(sun.path, { stroke: "black", fill: "white" });
bt.join(borderLines, subjectPolylines);
drawLines(t4.path, { stroke: "black", fill: "white" });

drawLines(borderLines, { stroke: "none", fill: "white" });
drawLines(lines);
