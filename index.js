/*
@title: Minecraft Grass Block
@author: PonderSlime
@snapshot: the name of the snapshot file you want in the gallery
*/

const width = 125;
const height = 125;
const lineThickness = 1.5;

setDocDimensions(width, height);
const t = new bt.Turtle();

const createRect = (turtle, width, height) => {
  for (let i = 0; i < 4; i++) {
    const size = i % 2 == 0 ? width : height;
    turtle.forward(size);
    turtle.left(90);
  }
};of y
const createRectNoTurtle = (width, height) => {
  const turtle = new bt.Turtle();
  
  for (let i = 0; i < 4; i++) {
    const size = i % 2 == 0 ? width : height;
    turtle.forward(size);
    turtle.left(90);
  }

  return turtle.lines();
};
const createShape = (turtle, n, size) => {
  const turnAngle = 360 / n;

  for (let i = 0; i < n; i++) {
    turtle.forward(size);
    turtle.left(turnAngle);
  }
};
const createLines = (width, height) => {
  const t = new bt.Turtle();

  for (let i = 0; i < height; i++) {
    t.forward(width);
    t.up();
    t.left(90);
    t.forward(2);
    t.left(90);
    t.forward(width);
    t.left(180);
    t.down();
  }

  return t.lines();
}
const createCube = (width, height, depth) => {
  const t = new bt.Turtle();

  createRect(t, width, height);
  
  t.up();
  t.forward(width);

  t.down();
  t.left(45);
  t.forward(depth / 2);

  t.left(45);
  t.forward(height);

  t.left(90);
  t.forward(width);

  t.left(45);
  t.forward(depth / 2);

  t.up();
  t.left(135);
  t.forward(width);

  t.down();
  t.left(45);
  t.forward(depth / 2);

  return t.lines();
};
const createGrid = (width, height, spacing) => {
  let lines = []

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const square = createRectNoTurtle(spacing, spacing);
      bt.translate(square, [spacing * j, spacing * i], bt.bounds(square).bl);

      lines = lines.concat(square);
    }
  }

  return lines;
}

let finalLines = [];
const cube = createCube(85, 85, 48);
bt.translate(cube, [width / 2, height / 2], bt.bounds(cube).cc);

const grid = createGrid(16, 16, 5.3);
bt.translate(grid, [108 / 2, 108 / 2], bt.bounds(grid).cc);

//finalLines = finalLines.concat();
finalLines = finalLines.concat(cube);
drawLines(grid, { width: lineThickness / 4 });

// draw it
drawLines(finalLines, { width : lineThickness });