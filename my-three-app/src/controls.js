import { updateGridVisuals, spawnRandomTile, GRID_SIZE } from './grid.js';

export function handleKeyPress(event, gridObj, scene) {
  const key = event.key;
  const { grid } = gridObj;
  let moved = false;

  switch (key) {
    case 'ArrowLeft':
      moved = moveGrid(grid, 0, -1);
      break;
    case 'ArrowRight':
      moved = moveGrid(grid, 0, 1);
      break;
    case 'ArrowUp':
      moved = moveGrid(grid, -1, 0);
      break;
    case 'ArrowDown':
      moved = moveGrid(grid, 1, 0);
      break;
  }

  if (moved) {
    spawnRandomTile(grid);
    updateGridVisuals(gridObj, scene);
  }
}

function moveGrid(grid, dy, dx) {
  let moved = false;
  const size = GRID_SIZE;

  const combine = (row) => {
    for (let i = 0; i < size - 1; i++) {
      if (row[i] !== 0 && row[i] === row[i + 1]) {
        row[i] *= 2;
        row[i + 1] = 0;
      }
    }
    return row.filter(val => val !== 0).concat(Array(size).fill(0)).slice(0, size);
  };

  if (dx !== 0) {
    for (let y = 0; y < size; y++) {
      let row = grid[y].slice();
      if (dx > 0) row.reverse();
      const newRow = combine(row);
      if (dx > 0) newRow.reverse();
      if (!arraysEqual(grid[y], newRow)) moved = true;
      grid[y] = newRow;
    }
  } else if (dy !== 0) {
    for (let x = 0; x < size; x++) {
      let col = grid.map(row => row[x]);
      if (dy > 0) col.reverse();
      const newCol = combine(col);
      if (dy > 0) newCol.reverse();
      for (let y = 0; y < size; y++) {
        if (grid[y][x] !== newCol[y]) moved = true;
        grid[y][x] = newCol[y];
      }
    }
  }

  return moved;
}

function arraysEqual(a, b) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}
