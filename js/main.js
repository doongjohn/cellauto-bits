class WorldConfig {
  static Wrapped = 0;
  static Finite = 1;
}

const worldConfig = WorldConfig.Wrapped;
const grid = new Grid({
  gridSize: { x: 200, y: 200 },
  cellSize: { x: 4, y: 4 }
});
const others = [];
others.length = 4;

function init() {
  for (let i = 0; i < grid.cells.length; ++i) {
    // init cells
    grid.cells[i] = new Cell(getRandomInt(0, 256));
  }
}

function loop() {
  // clear screen
  gl.clearRect(0, 0, canvas.width, canvas.height);

  grid.iterCellsScreenPos(function (i, pos) {
    // set color
    {
      const hex = grid.cells[i].data.toString(16).replace('-', '');
      const x = hex[0], y = hex[1];
      gl.fillStyle = `#${x}f${y}faa`;
      // gl.fillStyle = `#f${hex}f${hex}`;
    }

    // draw rect
    gl.fillRect(pos.x, pos.y, grid.cellSize.x, grid.cellSize.y);

    // do calculation
    const gridPos = grid.indexToGridPos(i);
    switch (worldConfig) {
      case WorldConfig.Wrapped:
        others[0] = grid.cells[grid.gridPosToIndex(gridPos.x + 1 >= grid.gridSize.x ? 0 : gridPos.x + 1, gridPos.y)].data;
        others[1] = grid.cells[grid.gridPosToIndex(gridPos.x - 1 < 0 ? grid.gridSize.x - 1 : gridPos.x - 1, gridPos.y)].data;
        others[2] = grid.cells[grid.gridPosToIndex(gridPos.x, gridPos.y + 1 >= grid.gridSize.y ? 0 : gridPos.y + 1)].data;
        others[3] = grid.cells[grid.gridPosToIndex(gridPos.x, gridPos.y - 1 < 0 ? grid.gridSize.y - 1 : gridPos.y - 1)].data;
        break;
      case WorldConfig.Finite:
        gridPos.x + 1 >= grid.gridSize.x || (others[0] = grid.cells[grid.gridPosToIndex(gridPos.x + 1, gridPos.y)].data);
        gridPos.y + 1 >= grid.gridSize.y || (others[1] = grid.cells[grid.gridPosToIndex(gridPos.x, gridPos.y + 1)].data);
        gridPos.x - 1 < 0 || (others[2] = grid.cells[grid.gridPosToIndex(gridPos.x - 1, gridPos.y)].data);
        gridPos.y - 1 < 0 || (others[3] = grid.cells[grid.gridPosToIndex(gridPos.x, gridPos.y - 1)].data);
        break;
    }
    grid.cells[i].calcNewDataRunner(4, ...others);
  });

  // apply calculated data
  grid.iterCellsScreenPos(function (i, pos) {
    grid.cells[i].applyNewData();
  });

  // render loop
  requestAnimationFrame(loop);
};

function main() {
  init();
  loop();
}

main();