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
    this.bgAu = new Audio("theme.mp3");
    this.winAu = new Audio("winTheme.mp3");
    this.start = { x: 0, y: 1 };
    this.player = this.start;
    this.end = { x: 29, y: 28 };
    this.rq = null;
  }

  drawRect(i, j, style) {
    ctx.fillStyle = style;
    ctx.fillRect(i * this.size, j * this.size, this.size, this.size);
  }

  play() {
    this.rq = requestAnimationFrame(this.play.bind(this));
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
        } else {
          this.drawRect(i, j, "white");
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
    this.grid[this.end.x][this.end.y] = true;
  }

  moveUp() {
    if (
      this.player.y > 0 &&
      this.player.y < this.size &&
      this.grid[this.player.x][this.player.y - 1] == true
    ) {
      this.player.y--;
    }
  }
  moveDown() {
    if (
      this.player.y >= 0 &&
      this.player.y < this.size &&
      this.grid[this.player.x][this.player.y + 1] == true
    ) {
      this.player.y++;
    }
  }
  moveLeft() {
    if (
      this.player.y > 0 &&
      this.player.y < this.size &&
      this.grid[this.player.x - 1][this.player.y] == true
    ) {
      this.player.x--;
    }
  }
  moveRight() {
    if (
      this.player.y >= 0 &&
      this.player.y < this.size &&
      this.grid[this.player.x + 1][this.player.y] == true
    ) {
      this.player.x++;
    }
  }

  checkWin() {
    if (this.player.x == this.end.x && this.player.y == this.end.y) {
      this.bgAu.pause();
      this.winAu.play();
      cancelAnimationFrame(this.rq);
    }
  }
}

const mario = new Mario();
window.onload = () => {
  mario.createGrid();
  mario.createMaze();
  mario.finishMaze();
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
