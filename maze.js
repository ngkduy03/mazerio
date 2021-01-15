class Mario {
  constructor() {
    this.size = 30;
    this.squareSize = 30;
    this.grid = [];

    // image
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
    this.flowerImg = new Image();
    this.flowerImg.src = "flower.png";
    this.bgImg = new Image();
    this.bgImg.src = "bg.png";
    this.winImg = new Image();
    this.winImg.src = "winingImg.jpg";
    this.loseImg = new Image();
    this.loseImg.src = "loseImg.jpg";
    this.timerImg = new Image();
    this.timerImg.src = "timer.png";
    //audio
    this.bgAu = new Audio("theme.mp3");
    this.bgAu.loop = true;
    this.winAu = new Audio("winTheme.mp3");
    this.loseAu = new Audio("lose.mp3");

    //others
    this.start = null;
    this.player = null;
    this.end = null;
    this.rq = null;
    this.canvas = null;
    this.ctx = null;
    this.div = document.getElementById("canvasDiv");
    this.time = null;
    this.interval = null;
    this.count = null;
  }

  init() {
    this.time = 30;
    this.count = 0;
    // player
    this.start = { x: 0, y: ~~(Math.random() * (this.size - 2) + 1) };
    this.player = this.start;
    this.end = { x: 29, y: ~~(Math.random() * (this.size - 2) + 1) };
    this.canvas = document.createElement("canvas");
    this.canvas.id = "myCanvas";
    this.canvas.width = 900;
    this.canvas.height = 900;
    this.ctx = this.canvas.getContext("2d");
    this.div.appendChild(this.canvas);
    this.bgAu.volume = 0.1;
    this.bgAu.play();
  }

  timing() {
    this.interval = setInterval(() => {
      this.time--;
      if (this.time == 0) {
        this.loseAu.volume = 0.1;
        this.bgAu.pause();
        this.loseAu.play();
        clearInterval(this.interval);
        cancelAnimationFrame(this.rq);
        this.ctx.drawImage(this.loseImg, 0, 0, 900, 900);
        document.getElementById("playBtn").innerHTML = "Again";
      }
    }, 1000);
  }

  drawRect(i, j, style = "black") {
    this.ctx.fillStyle = style;
    this.ctx.fillRect(
      i * this.size,
      j * this.size,
      this.squareSize,
      this.squareSize
    );
  }

  play() {
    this.rq = requestAnimationFrame(this.play.bind(this));
    this.count < 2 && this.count++;
    // bg
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if ((i == 0 && j == 0) || (i == 1 && j == 0)) {
          this.drawRect(i,j);
        }
        else if (this.grid[i][j] == false) {
          this.ctx.drawImage(
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
    this.ctx.drawImage(
      this.marioImg,
      this.player.x * this.squareSize,
      this.player.y * this.squareSize,
      this.squareSize,
      this.squareSize
    );

    //peach
    this.ctx.drawImage(
      this.peachImg,
      this.end.x * this.squareSize,
      this.end.y * this.squareSize,
      this.squareSize,
      this.squareSize
    );

    for (let i = 5; i < this.size; i += 5) {
      this.ctx.drawImage(
        this.coinImg,
        i * this.squareSize,
        0,
        this.squareSize,
        this.squareSize
      );
      this.ctx.drawImage(
        this.mushroomImg,
        i * this.squareSize,
        (this.size - 1) * this.squareSize,
        this.squareSize,
        this.squareSize
      );
    }
    this.ctx.drawImage(this.timerImg, 0, 0, this.squareSize, this.squareSize);
    this.ctx.fillStyle = "white";
    this.ctx.font = "30px Arial";
    this.ctx.fillText(
      parseInt((this.time / 10)) > 0? `${ this.time}`: `0${this.time}`,
      this.squareSize,
      this.squareSize - 5,
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
      this.drawRect(this.player.x, this.player.y);
      this.player.y--;
    }
  }
  moveDown() {
    if (
      this.player.y >= 0 &&
      this.player.y < this.size &&
      this.grid[this.player.x][this.player.y + 1] == true
    ) {
      this.drawRect(this.player.x, this.player.y);
      this.player.y++;
    }
  }
  moveLeft() {
    if (
      this.player.y > 0 &&
      this.player.y < this.size &&
      this.grid[this.player.x - 1][this.player.y] == true
    ) {
      this.drawRect(this.player.x, this.player.y);
      this.player.x--;
    }
  }
  moveRight() {
    if (
      this.player.y >= 0 &&
      this.player.y < this.size &&
      this.grid[this.player.x + 1][this.player.y] == true
    ) {
      this.drawRect(this.player.x, this.player.y);
      this.player.x++;
    }
  }

  checkWin() {
    if (this.player.x == this.end.x && this.player.y == this.end.y) {
      this.bgAu.pause();
      this.winAu.volume = 0.1;
      this.winAu.play();
      cancelAnimationFrame(this.rq);
      clearInterval(this.interval);
      this.ctx.drawImage(this.winImg, 0, 0, 900, 900);
      document.getElementById("playBtn").innerHTML = "Again";
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
    return (
      cell.x > -1 && cell.y > -1 && cell.x < this.size && cell.y < this.size
    );
  }

  random_range(start, end) {
    return ~~(Math.random() * (end - start) + start);
  }

  find_path(x1, y1, x2, y2) {
    const path = Array.from({ length: this.size * this.size }, () => ({
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
        if (this.grid[cell_top.x][cell_top.y]) {
          path[cell_top.x + cell_top.y * this.size].weight = 1;
          path[
            cell_top.x + cell_top.y * this.size
          ].adjacent = visited.getByIndex(0);
          visited.add(cell_top.x + cell_top.y * this.size);
        }
      }
      if (this.inbound(cell_left)) {
        if (this.grid[cell_left.x][cell_left.y]) {
          path[cell_left.x + cell_left.y * this.size].weight = 1;
          path[
            cell_left.x + cell_left.y * this.size
          ].adjacent = visited.getByIndex(0);
          visited.add(cell_left.x + cell_left.y * this.size);
        }
      }
      if (this.inbound(cell_right)) {
        if (this.grid[cell_right.x][cell_right.y]) {
          path[cell_right.x + cell_right.y * this.size].weight = 1;
          path[
            cell_right.x + cell_right.y * this.size
          ].adjacent = visited.getByIndex(0);
          visited.add(cell_right.x + cell_right.y * this.size);
        }
      }
      if (this.inbound(cell_bot)) {
        if (this.grid[cell_bot.x][cell_bot.y]) {
          path[cell_bot.x + cell_bot.y * this.size].weight = 1;
          path[
            cell_bot.x + cell_bot.y * this.size
          ].adjacent = visited.getByIndex(0);
          visited.add(cell_bot.x + cell_bot.y * this.size);
        }
      }
    }

    do {
      previous_path = JSON.parse(JSON.stringify(path));
      for (let i = 1; i < visited.size; ++i) {
        let element = visited.getByIndex(i);
        let center = {
          x: element % this.size,
          y: Math.floor(element / this.size),
        };
        let cell_top = { x: center.x, y: center.y - 1 };
        let cell_bot = { x: center.x, y: center.y + 1 };
        let cell_left = { x: center.x - 1, y: center.y };
        let cell_right = { x: center.x + 1, y: center.y };
        if (this.inbound(cell_top)) {
          if (mario.grid[cell_top.x][cell_top.y])
            if (
              path[cell_top.x + cell_top.y * this.size].weight == -1 ||
              path[cell_top.x + cell_top.y * this.size].weight >
                path[center.x + center.y * this.size].weight + 1
            ) {
              path[cell_top.x + cell_top.y * this.size].weight =
                path[center.x + center.y * this.size].weight + 1;
              path[cell_top.x + cell_top.y * this.size].adjacent =
                center.x + center.y * this.size;
              visited.add(cell_top.x + cell_top.y * this.size);
            }
        }
        if (this.inbound(cell_left)) {
          if (this.grid[cell_left.x][cell_left.y])
            if (
              path[cell_left.x + cell_left.y * this.size].weight == -1 ||
              path[cell_left.x + cell_left.y * this.size].weight >
                path[center.x + center.y * this.size].weight + 1
            ) {
              path[cell_left.x + cell_left.y * this.size].weight =
                path[center.x + center.y * this.size].weight + 1;
              path[cell_left.x + cell_left.y * this.size].adjacent =
                center.x + center.y * this.size;
              visited.add(cell_left.x + cell_left.y * this.size);
            }
        }
        if (this.inbound(cell_right)) {
          if (this.grid[cell_right.x][cell_right.y]) {
            if (
              path[cell_right.x + cell_right.y * this.size].weight == -1 ||
              path[cell_right.x + cell_right.y * this.size].weight >
                path[center.x + center.y * this.size].weight + 1
            ) {
              path[cell_right.x + cell_right.y * this.size].weight =
                path[center.x + center.y * this.size].weight + 1;
              path[cell_right.x + cell_right.y * this.size].adjacent =
                center.x + center.y * this.size;
              visited.add(cell_right.x + cell_right.y * this.size);
            }
          }
        }
        if (this.inbound(cell_bot)) {
          if (this.grid[cell_bot.x][cell_bot.y]) {
            if (
              path[cell_bot.x + cell_bot.y * this.size].weight == -1 ||
              path[cell_bot.x + cell_bot.y * this.size].weight >
                path[center.x + center.y * this.size].weight + 1
            ) {
              path[cell_bot.x + cell_bot.y * this.size].weight =
                path[center.x + center.y * this.size].weight + 1;
              path[cell_bot.x + cell_bot.y * this.size].adjacent =
                center.x + center.y * this.size;
            }
            visited.add(cell_bot.x + cell_bot.y * this.size);
          }
        }
      }
    } while (!this.arraysEqual(path, previous_path));
    let result = [];
    let current = x2 + y2 * this.size;
    do {
      if (path[current].adjacent == -1 || path[current].weight == -1) {
        return 0;
      }
      result.push({
        x: current % this.size,
        y: Math.floor(current / this.size),
      });
      current = path[current].adjacent;
    } while (current != visited.getByIndex(0));

    return result;
  }

  showHint(hint) {
    this.player.x = this.start.x;
    this.player.y = this.start.y;
    for (let i = 1; i < hint.length; i++) {
      this.ctx.drawImage(
        this.flowerImg,
        hint[i].x * this.squareSize,
        hint[i].y * this.squareSize,
        this.squareSize,
        this.squareSize
      );
    }
  }
}

Set.prototype.getByIndex = function (index) {
  return [...this][index];
};

const mario = new Mario();
function game() {
  let hint = null;
  do {
    mario.createGrid();
    mario.createMaze();
    hint = mario.find_path(
      mario.start.x,
      mario.start.y,
      mario.end.x,
      mario.end.y
    );
  } while (hint === 0);
  mario.finishMaze();
  mario.play();
}

window.onload = () => {
  //button
  let hasPlayed = false;
  const solutionBtn = document.getElementById("solutionBtn");
  const aboutBtn = document.getElementById("aboutBtn");
  const playBtn = document.getElementById("playBtn");
  const instrucBtn = document.getElementById("instruction");
  mario.init();
  mario.ctx.drawImage(mario.bgImg, 0, 0, 900, 900);
  //play game
  playBtn.onclick = () => {
    hasPlayed = true;
    mario.ctx.clearRect(0, 0, 900, 900);
    if (mario.time == 0 || (mario.player.x == mario.end.x && mario.player.y == mario.end.y)) {
      mario.div.removeChild(mario.canvas);
      mario.init();
      mario.div.appendChild(mario.canvas);
    }
    
    if(mario.count < 1) {
      game();
      mario.timing();
      playBtn.innerHTML = "";
    }
  };

  //show hint
  solutionBtn.onclick = () => {
    if (hasPlayed) {
      hint = mario.find_path(
        mario.player.x,
        mario.player.y,
        mario.end.x,
        mario.end.y
      );
      mario.showHint(hint);
    }
  };
  
  //about
  aboutBtn.onclick = () => {
    alert(
      "This is a Mario Maze fangame project belong to discrete mathematics final exam. It applies the knowledge of finding shortest path, namely the Dijkstra's algorithm to help mario find the shortest way to rescue princess in short time! \n\n Our team: \n Nguyen Khang Duy \n Le Ho Hai Duong \n Do Ngoc Anh Vien \n Huynh Cong Dat"
    );
  };
  //instruction
  instrucBtn.onclick = () => {
    alert(
      "The princess has been kidnaped by Bowser and imprisoned in a maze. Your mission is to cross the maze to rescue the princess. You only have 30 seconds, so hurry up before it's too late!\n\nHow to play:\nUse Arrow keys to move"
    );
  };
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
