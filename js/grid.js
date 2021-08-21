class Grid {
  constructor({
    gridSize = { x: 200, y: 200 },
    cellSize = { x: 4, y: 4 },
    cellGap = 0
  } = {}) {
    this.pos = { ...center };
    this.gridSize = gridSize;
    this.cellSize = cellSize;
    this.cellGap = cellGap;

    this.width = gridSize.x * (cellSize.x + cellGap);
    this.height = gridSize.y * (cellSize.y + cellGap);

    this.cells = [];
    this.cells.length = gridSize.x * gridSize.y;
    this.cells.fill(null);
  }

  isOutOfBound(x, y) {
    return (
      x < 0 ||
      y < 0 ||
      x >= this.gridSize.x ||
      y >= this.gridSize.y
    );
  }

  indexToGridPos(i) {
    if (i >= this.cells.length) {
      console.error('out of grid bound!');
      return null;
    } else {
      return {
        x: i % this.gridSize.x,
        y: Math.floor(i / this.gridSize.x)
      };
    }
  }
  gridPosToIndex(x, y) {
    if (this.isOutOfBound(x, y)) {
      console.error('out of grid bound!');
      return null;
    } else {
      return (y * this.gridSize.x) + x;
    }
  }
  gridToScreenPos(x, y) {
    if (this.isOutOfBound(x, y)) {
      console.error('out of grid bound!');
      return null;
    } else {
      return {
        x: this.pos.x - (this.width - this.cellGap) / 2 + (this.cellSize.x + this.cellGap) * x,
        y: this.pos.y - (this.height - this.cellGap) / 2 + (this.cellSize.y + this.cellGap) * y
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