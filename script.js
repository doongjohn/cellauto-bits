const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const center = { x: canvas.width / 2, y: canvas.height / 2 };

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  center.x = canvas.width / 2;
  center.y = canvas.height / 2;
});

const gl = canvas.getContext('2d');


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; // 최댓값은 제외, 최솟값은 포함
}


class Grid {
  constructor() {
    this.pos = { ...center };
    this.gridSize = { x: 10, y: 10 };
    this.cellSize = { x: 50, y: 50 };
    this.cellGap = 4;

    this.width = this.gridSize.x * (this.cellSize.x + this.cellGap);
    this.height = this.gridSize.y * (this.cellSize.y + this.cellGap);

    this.cells = [];
    this.cells.length = this.gridSize.x * this.gridSize.y;
    this.cells.fill(null);
  }
  isOutOfBound(x, y) {
    return x < 0 || x >= this.gridSize.x || y < 0 || y >= this.gridSize.y;
  }
  indexToGridPos(i) {
    if (i >= this.cells.length) {
      console.error('out of grid bound!');
      return null;
    } else {
      return {
        x: i % this.gridSize.x,
        y: Math.floor(i / this.gridSize.y)
      };
    }
  }
  gridToScreenPos(x, y) {
    if (this.isOutOfBound(x, y)) {
      console.error('out of grid bound!');
      return null;
    } else {
      return {
        x: center.x - (this.width - this.cellGap) / 2 + (this.cellSize.x + this.cellGap) * x,
        y: center.y - (this.height - this.cellGap) / 2 + (this.cellSize.y + this.cellGap) * y
      };
    }
  }
  iterCellsScreenPos(fn) {
    for (let i = 0; i < this.cells.length; ++i) {
      const gridPos = this.indexToGridPos(i);
      fn(i, this.gridToScreenPos(gridPos.x, gridPos.y));
    }
  }
}

class Cell {
  constructor(data) {
    this.data = data; // 8bit clamped (0-255)
    this.newData = data;
  }
  calcNewData(...others) {
    let result = this.data;
    for (const other of others) {
      if (!other) continue;
      let a = Math.min((result >>> 2), 255) ^ Math.min((other << 3), 255);
      let b = Math.min((result << 3), 255) ^ Math.min((other >>> 2), 255);
      result = a ^ b;
    }
    this.newData = result;
  }
  setNewData() {
    this.data = this.newData;
  }
}

const grid = new Grid();
for (let i = 0; i < grid.cells.length; ++i) {
  grid.cells[i] = new Cell(getRandomInt(0, 256));
}

function loop() {
  grid.iterCellsScreenPos((i, pos) => {
    const hex = grid.cells[i].data.toString(16);
    const rest = "#" + "0".repeat(6 - hex.length);
    gl.fillStyle = rest + hex;
    gl.fillRect(pos.x, pos.y, grid.cellSize.x, grid.cellSize.y);
    grid.cells[i].calcNewData(
      grid.cells[i + 1],
      grid.cells[i - 1]
    );
  });

  grid.iterCellsScreenPos((i, pos) => {
    grid.cells[i].setNewData();
  });

  setInterval(loop, 2 * 1000);
  // requestAnimationFrame(loop);
};
loop();
