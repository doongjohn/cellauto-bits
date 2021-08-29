class WorldConfig {
  static Wrapped = 0; // this is more elegant
  static Finite = 1;  // this is more interesting
}

const worldConfig = WorldConfig.Finite;
const grid = new Grid({
  gridSize: { x: 220, y: 220 },
  cellSize: { x: 4, y: 4 }
});
const others = [];
others.length = 4;

function init() {
  // init cells
  for (let i = 0; i < grid.cells.length; ++i) {
    grid.cells[i] = new Cell(getRandomInt(0, 256)); // random cell data
    // grid.cells[i] =  new Cell(0);
  }
  // const iCenter = grid.cells.length / 2 + grid.gridSize.x / 2;
  // const gCenter = grid.indexToGridPos(iCenter);
  // grid.cells[iCenter] = new Cell(255);
  // grid.cells[iCenter+1] = new Cell(100);
  // grid.cells[iCenter-1] = new Cell(100);
  // grid.cells[grid.gridPosToIndex(gCenter.x, gCenter.y + 1)] = new Cell(100);
  // grid.cells[grid.gridPosToIndex(gCenter.x, gCenter.y - 1)] = new Cell(100);
}

function toBinString(num) {
  let result = '';
  if (num < 0)
    for (let i = 4; i >= 0; --i)
      result += ((num >>> 0) >> i) % 2;
  else
    for (let i = 4; i >= 0; --i)
      result += (num >> i) % 2;
  return result;
}

function loop() {
  // clear screen
  gl.clearRect(0, 0, canvas.width, canvas.height);

  grid.iterCellsScreenPos(function (i, pos) {
    // set color
    {
      let hex = (255 - parseInt(toBinString(grid.cells[i].data), 2)).toString(16);
      hex.length < 2 && (hex += '0');
      // console.log(hex);
      const x = hex[0];
      const y = hex[1];
      // gl.fillStyle = `#fff${hex}f`;
      // gl.fillStyle = `#${x}f${y}fff`;
      gl.fillStyle = `#${x}f${y}faa`;
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
    grid.cells[i].calcNewDataRunner(3, ...others);
  });

  // apply calculated data
  grid.iterCellsScreenPos(function (i, pos) {
    grid.cells[i].applyNewData();
  });

  // render loop
  requestAnimationFrame(loop);
  // setTimeout(loop, 500);
};

function main() {
  init();
  loop();
}

main();