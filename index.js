/*@title: spiral_pattern
@author: PonderSlime
@snapshot: the name of the snapshot file you want in the gallery*/

const canvasWidth = 125;
const canvasHeight = 125;

const lineThickness = 1.5;
const line_spacing = 1.5;
const num1 = bt.randInRange(30, 180);
const num2 = bt.randInRange(30, 180);
const scale = (bt.randInRange(2, 11) + 0.7);
const lineLength = 2.5 * scale

setDocDimensions(canvasWidth, canvasHeight);

const t = new bt.Turtle();

const finalLines = [];
const finalLinesBounds = bt.bounds(finalLines);

const createShape = (turtle, n, size) => {  
  const turnAngle = 360 / n;  for (let i = 0; i < n; i++) {
    turtle.forward(size);
    turtle.left(turnAngle);  }};
const createLines = (canvasWidth, canvasHeight) => {
  const t = new bt.Turtle();
  for (let i = 0; i < canvasHeight; i++) {
    t.forward(lineLength);
    t.up();
    t.left(num1);
    t.forward(lineLength);
    t.left(num2);
    t.forward(lineLength);
    t.left(num1);
    t.down();
  }  
  return t.lines();
}
const lines = createLines(canvasWidth, canvasHeight);
bt.translate(lines, [canvasWidth / 2, canvasHeight / 2], bt.bounds(lines).cc);
bt.join(finalLines, lines)

drawLines(finalLines);