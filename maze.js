const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

class Mario {
  constructor() {
    this.size = 30;
    this.squareSize = 30;
    this.grid = [];
    this.marioImg = new Image();
    this.marioImg.src = "mario.png";
    this.peachImg = new Image();
    this.peachImg.src = "peach.png";
    this.brickImg = new Image();
    this.brickImg.src = "brick.png";
    this.coinImg = new Image();
    this.coinImg.src = "coin.png";
    this.mushroomImg = new Image();
    this.mushroomImg.src = "mushroom.png";

    this.bgAu = new Audio("theme.mp3");
    this.winAu = new Audio("winTheme.mp3");
    this.start = { x: 0, y: 1 };
    this.player = this.start;
    this.end = { x: 29, y: 28 };
    this.rq = null;
  }

  drawRect(i, j, style = "black") {
    ctx.fillStyle = style;
    ctx.fillRect(
      i * this.size,
      j * this.size,
      this.squareSize,
      this.squareSize
    );
  }

  play() {
    this.rq = requestAnimationFrame(this.play.bind(this));
    this.bgAu.volume = 0.1;
    this.bgAu.play();

    // bg
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.grid[i][j] == false) {
          ctx.drawImage(
            this.brickImg,
            i * this.squareSize,
            j * this.squareSize,
            this.squareSize,
            this.squareSize
          );
        }
      }
    }

    //mario
    ctx.drawImage(
      this.marioImg,
      this.player.x * this.squareSize,
      this.player.y * this.squareSize,
      this.squareSize,
      this.squareSize
    );

    //peach
    ctx.drawImage(
      this.peachImg,
      this.end.x * this.squareSize,
      this.end.y * this.squareSize,
      this.squareSize,
      this.squareSize
    );

    for (let i = 5; i < this.size; i += 5) {
      ctx.drawImage(
        this.coinImg,
        0,
        i * this.squareSize,
        this.squareSize,
        this.squareSize
      );
      ctx.drawImage(
        this.mushroomImg,
        (this.size - 1) * this.squareSize,
        i * this.squareSize,
        this.squareSize,
        this.squareSize
      );
    }

    this.checkWin();
  }

  createGrid() {
    for (let i = 0; i < this.size; i++) {
      this.grid.push([]);
      for (let j = 0; j < this.size; j++) {
        this.grid[i][j] = false;
      }
    }
  }

  addWall(walls, cell) {
    if (cell.x + 1 < this.size) {
      walls.push({ x: cell.x + 1, y: cell.y });
    }
    if (cell.x - 1 >= 0) {
      walls.push({ x: cell.x - 1, y: cell.y });
    }
    if (cell.y + 1 < this.size) {
      walls.push({ x: cell.x, y: cell.y + 1 });
    }
    if (cell.y - 1 >= 0) {
      walls.push({ x: cell.x, y: cell.y - 1 });
    }
  }

  addNeighbours(walls, unvisited) {
    if (
      unvisited[0].x + 1 < this.size &&
      this.grid[unvisited[0].x + 1][unvisited[0].y] == false
    ) {
      walls.push({ x: unvisited[0].x + 1, y: unvisited[0].y });
    }
    if (
      unvisited[0].x - 1 > 0 &&
      this.grid[unvisited[0].x - 1][unvisited[0].y] == false
    ) {
      walls.push({ x: unvisited[0].x - 1, y: unvisited[0].y });
    }
    if (
      unvisited[0].y + 1 < this.size &&
      this.grid[unvisited[0].x][unvisited[0].y + 1] == false
    ) {
      walls.push({ x: unvisited[0].x, y: unvisited[0].y + 1 });
    }
    if (
      unvisited[0].y - 1 > 0 &&
      this.grid[unvisited[0].x][unvisited[0].y - 1] == false
    ) {
      walls.push({ x: unvisited[0].x, y: unvisited[0].y - 1 });
    }
  }

  getCell(wall, unvisited) {
    if (wall.x + 1 < this.size - 1 && this.grid[wall.x + 1][wall.y] == true) {
      unvisited.push({ x: wall.x - 1, y: wall.y });
    }
    if (wall.x - 1 > 0 && this.grid[wall.x - 1][wall.y] == true) {
      unvisited.push({ x: wall.x + 1, y: wall.y });
    }
    if (wall.y + 1 < this.size - 1 && this.grid[wall.x][wall.y + 1] == true) {
      unvisited.push({ x: wall.x, y: wall.y - 1 });
    }
    if (wall.y - 1 > 0 && this.grid[wall.x][wall.y - 1] == true) {
      unvisited.push({ x: wall.x, y: wall.y + 1 });
    }
  }

  createMaze() {
    const cell = {
      x: ~~(Math.random() * this.size),
      y: ~~(Math.random() * this.size),
    };

    this.grid[cell.x][cell.y] = true;
    const walls = [];
    this.addWall(walls, cell);

    while (walls.length > 0) {
      const wallIndex = ~~(Math.random() * walls.length);
      const wall = walls[wallIndex];

      const unvisited = [];
      this.getCell(wall, unvisited);
      if (unvisited.length == 1) {
        this.grid[wall.x][wall.y] = true;
        if (
          unvisited[0].x >= 0 &&
          unvisited[0].x < this.size &&
          unvisited[0].y >= 0 &&
          unvisited[0].y < this.size
        ) {
          this.grid[unvisited[0].x][unvisited[0].y] = true;
          this.addNeighbours(walls, unvisited);
        }
      }
      walls.splice(wallIndex, 1);
    }
  }

  finishMaze() {
    for (let i = 0; i < this.size; i++) {
      this.grid[0][i] = false;
      this.grid[i][0] = false;
      this.grid[i][this.size - 1] = false;
      this.grid[this.size - 1][i] = false;
    }

    this.grid[this.start.x][this.start.y] = true;
    this.grid[this.start.x + 1][this.start.y] = true;
    this.grid[this.end.x][this.end.y] = true;
    this.grid[this.end.x - 1][this.end.y] = true;
  }

  moveUp() {
    if (
      this.player.y > 0 &&
      this.player.y < this.size &&
      this.grid[this.player.x][this.player.y - 1] == true
    ) {
      this.drawRect(this.player.x, this.player.y, "white");
      this.player.y--;
    }
  }
  moveDown() {
    if (
      this.player.y >= 0 &&
      this.player.y < this.size &&
      this.grid[this.player.x][this.player.y + 1] == true
    ) {
      this.drawRect(this.player.x, this.player.y, "white");
      this.player.y++;
    }
  }
  moveLeft() {
    if (
      this.player.y > 0 &&
      this.player.y < this.size &&
      this.grid[this.player.x - 1][this.player.y] == true
    ) {
      this.drawRect(this.player.x, this.player.y, "white");
      this.player.x--;
    }
  }
  moveRight() {
    if (
      this.player.y >= 0 &&
      this.player.y < this.size &&
      this.grid[this.player.x + 1][this.player.y] == true
    ) {
      this.drawRect(this.player.x, this.player.y, "white");
      this.player.x++;
    }
  }

  checkWin() {
    if (this.player.x == this.end.x && this.player.y == this.end.y) {
      this.bgAu.pause();
      this.winAu.volume = 0.1;
      this.winAu.play();
      cancelAnimationFrame(this.rq);
      alert("You earn a kiss from princess. Ah no! How can you feel that since you don't have any girlfriend!");
    }
  }

  // hint
  arraysEqual(a, b) {
    for (var i = 0; i < a.length; ++i) {
      if (a[i].weight !== b[i].weight || a[i].adjacent != b[i].adjacent)
        return false;
    }
    return true;
  }

  inbound(cell) {
    return cell.x > -1 && cell.y > -1 && cell.x < this.size && cell.y < this.size;
  }

  random_range(start, end) {
    return Math.floor(Math.random() * (end - start) + start);
  }

  find_path(x1, y1, x2, y2) {
    let path = Array.from({ length: this.size * this.size }, () => ({
      weight: -1,
      adjacent: -1,
    }));
    let previous_path = Object;
    //path.fill(-1);
    let visited = new Set([x1 + y1 * this.size]);
    {
      let center = { x: x1, y: y1 };
  
      let cell_top = { x: center.x, y: center.y - 1 };
      let cell_bot = { x: center.x, y: center.y + 1 };
      let cell_left = { x: center.x - 1, y: center.y };
      let cell_right = { x: center.x + 1, y: center.y };
      if (this.inbound(cell_top)) {
        if (mario.grid[cell_top.x][cell_top.y]) {
          path[cell_top.x + cell_top.y * 30].weight = 1;
          path[cell_top.x + cell_top.y * 30].adjacent = visited.getByIndex(0);
          visited.add(cell_top.x + cell_top.y * 30);
        }
      }
      if (this.inbound(cell_left)) {
        if (mario.grid[cell_left.x][cell_left.y]) {
          path[cell_left.x + cell_left.y * 30].weight = 1;
          path[cell_left.x + cell_left.y * 30].adjacent = visited.getByIndex(0);
          visited.add(cell_left.x + cell_left.y * 30);
        }
      }
      if (this.inbound(cell_right)) {
        if (mario.grid[cell_right.x][cell_right.y]) {
          path[cell_right.x + cell_right.y * 30].weight = 1;
          path[cell_right.x + cell_right.y * 30].adjacent = visited.getByIndex(0);
          visited.add(cell_right.x + cell_right.y * 30);
        }
      }
      if (this.inbound(cell_bot)) {
        if (mario.grid[cell_bot.x][cell_bot.y]) {
          path[cell_bot.x + cell_bot.y * 30].weight = 1;
          path[cell_bot.x + cell_bot.y * 30].adjacent = visited.getByIndex(0);
          visited.add(cell_bot.x + cell_bot.y * 30);
        }
      }
    }
  
    do {
      previous_path = JSON.parse(JSON.stringify(path));
      for (let i = 1; i < visited.size; ++i) {
        let element = visited.getByIndex(i);
        let center = { x: element % 30, y: Math.floor(element / 30) };
        let cell_top = { x: center.x, y: center.y - 1 };
        let cell_bot = { x: center.x, y: center.y + 1 };
        let cell_left = { x: center.x - 1, y: center.y };
        let cell_right = { x: center.x + 1, y: center.y };
        if (this.inbound(cell_top)) {
          if (mario.grid[cell_top.x][cell_top.y])
            if (
              path[cell_top.x + cell_top.y * 30].weight == -1 ||
              path[cell_top.x + cell_top.y * 30].weight >
                path[center.x + center.y * 30].weight + 1
            ) {
              path[cell_top.x + cell_top.y * 30].weight =
                path[center.x + center.y * 30].weight + 1;
              path[cell_top.x + cell_top.y * 30].adjacent =
                center.x + center.y * 30;
              visited.add(cell_top.x + cell_top.y * 30);
            }
        }
        if (this.inbound(cell_left)) {
          if (mario.grid[cell_left.x][cell_left.y])
            if (
              path[cell_left.x + cell_left.y * 30].weight == -1 ||
              path[cell_left.x + cell_left.y * 30].weight >
                path[center.x + center.y * 30].weight + 1
            ) {
              path[cell_left.x + cell_left.y * 30].weight =
                path[center.x + center.y * 30].weight + 1;
              path[cell_left.x + cell_left.y * 30].adjacent =
                center.x + center.y * 30;
              visited.add(cell_left.x + cell_left.y * 30);
            }
        }
        if (this.inbound(cell_right)) {
          if (mario.grid[cell_right.x][cell_right.y]) {
            if (
              path[cell_right.x + cell_right.y * 30].weight == -1 ||
              path[cell_right.x + cell_right.y * 30].weight >
                path[center.x + center.y * 30].weight + 1
            ) {
              path[cell_right.x + cell_right.y * 30].weight =
                path[center.x + center.y * 30].weight + 1;
              path[cell_right.x + cell_right.y * 30].adjacent =
                center.x + center.y * 30;
              visited.add(cell_right.x + cell_right.y * 30);
            }
          }
        }
        if (this.inbound(cell_bot)) {
          if (mario.grid[cell_bot.x][cell_bot.y]) {
            if (
              path[cell_bot.x + cell_bot.y * 30].weight == -1 ||
              path[cell_bot.x + cell_bot.y * 30].weight >
                path[center.x + center.y * 30].weight + 1
            ) {
              path[cell_bot.x + cell_bot.y * 30].weight =
                path[center.x + center.y * 30].weight + 1;
              path[cell_bot.x + cell_bot.y * 30].adjacent =
                center.x + center.y * 30;
            }
            visited.add(cell_bot.x + cell_bot.y * 30);
          }
        }
      }
    } while (!this.arraysEqual(path, previous_path));
    let result = [];
    let current = x2 + y2 * 30;
    do {
      if (path[current].adjacent == -1 || path[current].weight == -1) {
        return 0;
      }
      result.push({ x: current % 30, y: Math.floor(current / 30) });
      current = path[current].adjacent;
    } while (current != visited.getByIndex(0));
    return result;
  }

 showHint(hint) {
   this.player.x = this.start.x;
   this.player.y = this.start.y;
    for (let i = 1; i < hint.length; i++) {
      mario.drawRect(hint[i].x, hint[i].y, "red");
    }
  }
}

Set.prototype.getByIndex = function (index) {
  return [...this][index];
};



const mario = new Mario();
window.onload = () => {
  do {
    mario.createGrid();
    mario.createMaze();
  } while (mario.find_path(mario.start.x, mario.start.y, mario.end.x, mario.end.y) === 0);
  mario.finishMaze();
  
  let hint = mario.find_path(1, 0, 29, 28);
  let clicked = false;
  //show hint
  const btn = document.getElementById("solutionBtn");
  btn.onclick = () => {
    mario.showHint(hint);
  }
  mario.play();
  
  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowUp":
        mario.moveUp();
        break;
      case "ArrowDown":
        mario.moveDown();
        break;
      case "ArrowLeft":
        mario.moveLeft();
        break;
      case "ArrowRight":
        mario.moveRight();
        break;
    }
  });
};
