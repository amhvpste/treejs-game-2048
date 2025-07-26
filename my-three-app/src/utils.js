export function getRandomEmptyCell(grid) {
  const empty = [];
  for (let x = 0; x < 4; x++) {
    for (let y = 0; y < 4; y++) {
      if (grid[x][y] === null) {
        empty.push({ x, y });
      }
    }
  }
  return empty.length ? empty[Math.floor(Math.random() * empty.length)] : null;
}
