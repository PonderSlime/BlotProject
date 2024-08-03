/*@title: spiral_pattern
@author: PonderSlime
@snapshot: the name of the snapshot file you want in the gallery*/

const width = 125;
const height = 125;

const lineThickness = 1.5;
const line_spacing = 1.5;
const num1 = bt.randInRange(0, 180);
const num2 = bt.randInRange(0, 2);

setDocDimensions(width, height);

const t = new bt.Turtle();

const finalLines = [];
const finalLinesBounds = bt.bounds(finalLines);

const createShape = (turtle, n, size) => {  
  const turnAngle = 360 / n;  for (let i = 0; i < n; i++) {
    turtle.forward(size);
    turtle.left(turnAngle);  }};
const createLines = (width, height) => {
  const t = new bt.Turtle();
  for (let i = 0; i < height; i++) {
    
    t.forward(width);
    t.up();
    t.left(num1);
    t.forward(2);
    t.left(num2);
    t.forward(width);
    t.left(num1 / num2 * num1);
    t.down();
  }  
  return t.lines();
}
const lines = createLines(width/ 2, height/ 2);
bt.translate(lines, [width / 2, height / 2], bt.bounds(lines).cc);
bt.join(finalLines, lines)  // all these are off by 5, not really sure why
bt.translate(finalLines, [5, 5]);
/*const border = [
  [[0, 0],
  [width, 0]  ],
  [[width, 0],
  [width, height]  ],
  [[width, height],
  [0, height]  ],
  [[0, height], 
  [0, 0]  ],];
bt.join(finalLines, border);*/

//finalLines = finalLines.concat();
//drawLines(line, { width: lineThickness });
// draw it
drawLines(finalLines);