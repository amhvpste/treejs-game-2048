import { Tile } from './tile.js';

export class Game2048 {
  constructor(scene, updateScore, onGameOver) {
    this.scene = scene;
    this.updateScore = updateScore;
    this.onGameOver = onGameOver;
    this.grid = [...Array(4)].map(() => Array(4).fill(null));
    this.score = 0;
  }

  init() {
    this.clear();
    this.addRandomTile();
    this.addRandomTile();
    this.updateScore(this.score);
  }

  clear() {
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        const tile = this.grid[y][x];
        if (tile) this.scene.remove(tile.mesh);
      }
    }
    this.grid = [...Array(4)].map(() => Array(4).fill(null));
    this.score = 0;
  }

  addRandomTile() {
    const empty = [];
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (!this.grid[y][x]) empty.push([x, y]);
      }
    }
    if (empty.length === 0) return false;
    const [x, y] = empty[Math.floor(Math.random() * empty.length)];
    const value = Math.random() < 0.9 ? 2 : 4;
    const tile = new Tile(value, x, y);
    this.grid[y][x] = tile;
    this.scene.add(tile.mesh);
    return true;
  }

  move(dx, dy) {
    let moved = false;

    const range = [0, 1, 2, 3];
    const iterate = (dx === 1 || dy === 1) ? range.slice().reverse() : range;

    for (let y of iterate) {
      for (let x of iterate) {
        const tile = this.grid[y][x];
        if (!tile) continue;

        let nx = x;
        let ny = y;

        while (true) {
          const tx = nx + dx;
          const ty = ny + dy;

          if (tx < 0 || tx >= 4 || ty < 0 || ty >= 4) break;
          const target = this.grid[ty][tx];

          if (!target) {
            this.grid[ty][tx] = tile;
            this.grid[ny][nx] = null;
            tile.moveTo(tx, ty);
            moved = true;
            nx = tx;
            ny = ty;
          } else if (target.value === tile.value && !target.merged && !tile.merged) {
            target.updateValue(target.value * 2);
            this.grid[ny][nx] = null;
            this.scene.remove(tile.mesh);
            tile.merged = true;
            this.score += target.value;
            moved = true;
            break;
          } else {
            break;
          }
        }
      }
    }

    // Скидаємо прапорці злиття
    for (let row of this.grid) {
      for (let tile of row) {
        if (tile) tile.merged = false;
      }
    }

    if (moved) {
      if (!this.addRandomTile()) {
        if (this.isGameOver()) {
          this.onGameOver(this.score);
        }
      }
      this.updateScore(this.score);
    }
  }

  update(delta) {
    for (let row of this.grid) {
      for (let tile of row) {
        if (tile) tile.update(delta);
      }
    }
  }

  isGameOver() {
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (!this.grid[y][x]) return false;
        const tile = this.grid[y][x];
        const neighbors = [
          [x + 1, y],
          [x - 1, y],
          [x, y + 1],
          [x, y - 1],
        ];
        for (const [nx, ny] of neighbors) {
          if (nx >= 0 && nx < 4 && ny >= 0 && ny < 4) {
            const neighborTile = this.grid[ny][nx];
            if (neighborTile && neighborTile.value === tile.value) return false;
          }
        }
      }
    }
    return true;
  }
}
