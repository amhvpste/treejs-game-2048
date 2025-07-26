import { Tile } from './Tile.js';
import { getRandomEmptyCell } from './utils.js';

export class Board {
  constructor(scene, font) {
    this.scene = scene;
    this.font = font;
    this.grid = [...Array(4)].map(() => Array(4).fill(null));
    this.tiles = [];
    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const pos = getRandomEmptyCell(this.grid);
    if (pos) {
      const value = Math.random() < 0.9 ? 2 : 4;
      const tile = new Tile(value, pos.x, pos.y, this.scene, this.font);
      this.grid[pos.x][pos.y] = tile;
      this.tiles.push(tile);
    }
  }

  move(dx, dy) {
    const moved = false;
    const merged = [...Array(4)].map(() => Array(4).fill(false));
    const order = [...Array(4).keys()];
    if (dx === 1) order.reverse();
    if (dy === 1) order.reverse();

    for (const i of order) {
      for (const j of order) {
        const x = dx !== 0 ? i : j;
        const y = dy !== 0 ? i : j;
        const tile = this.grid[x][y];
        if (!tile) continue;

        let nx = x;
        let ny = y;
        while (true) {
          const tx = nx + dx;
          const ty = ny + dy;
          if (tx < 0 || tx >= 4 || ty < 0 || ty >= 4) break;
          const next = this.grid[tx][ty];
          if (next === null) {
            nx = tx;
            ny = ty;
          } else if (!merged[tx][ty] && next.value === tile.value) {
            next.value *= 2;
            next.remove();
            this.grid[tx][ty] = new Tile(next.value, tx, ty, this.scene, this.font);
            merged[tx][ty] = true;
            tile.remove();
            this.grid[x][y] = null;
            return true;
          } else break;
        }
        if (nx !== x || ny !== y) {
          this.grid[nx][ny] = tile;
          this.grid[x][y] = null;
          tile.updatePosition(nx, ny);
          return true;
        }
      }
    }
    return false;
  }

  handleInput(key) {
    let moved = false;
    if (key === 'ArrowUp') moved = this.move(0, 1);
    if (key === 'ArrowDown') moved = this.move(0, -1);
    if (key === 'ArrowLeft') moved = this.move(-1, 0);
    if (key === 'ArrowRight') moved = this.move(1, 0);

    if (moved) this.addRandomTile();
  }
}
