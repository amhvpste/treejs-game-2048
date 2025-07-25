import * as THREE from 'three';

const TILE_SIZE = 2;
const GRID_SIZE = 4;
const COLORS = {
  0: 0xcccccc,
  2: 0xeee4da,
  4: 0xede0c8,
  8: 0xf2b179,
  16: 0xf59563,
  32: 0xf67c5f,
  64: 0xf65e3b,
  128: 0xedcf72,
  256: 0xedcc61,
  512: 0xedc850,
  1024: 0xedc53f,
  2048: 0xedc22e
};

export function createGrid(scene) {
  const grid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
  const tiles = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null));

  // Додаємо 2 стартові плитки
  spawnRandomTile(grid);
  spawnRandomTile(grid);

  // Створюємо куби в сцені
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const value = grid[y][x];
      const cube = createTile(value);
      cube.position.set(x * TILE_SIZE - 3, 0, y * TILE_SIZE - 3);
      scene.add(cube);
      tiles[y][x] = cube;
    }
  }

  return { grid, tiles };
}

export function updateGridVisuals(gridObj, scene) {
  const { grid, tiles } = gridObj;
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const value = grid[y][x];
      const tile = tiles[y][x];
      tile.material.color.setHex(COLORS[value] || 0x000000);

      // Видаляємо старий текст
      tile.children.forEach(child => tile.remove(child));

      if (value !== 0) {
        const canvas = document.createElement('canvas');
        const size = 128;
        canvas.width = canvas.height = size;
        const context = canvas.getContext('2d');
        context.fillStyle = 'white';
        context.font = 'bold 48px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(value.toString(), size / 2, size / 2);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(1, 1, 1);
        sprite.position.y = 0.6;
        tile.add(sprite);
      }
    }
  }
}

function createTile(value) {
  const geometry = new THREE.BoxGeometry(1.8, 0.5, 1.8);
  const material = new THREE.MeshPhongMaterial({ color: COLORS[value] || 0x000000 });
  const mesh = new THREE.Mesh(geometry, material);

  if (value !== 0) {
    const canvas = document.createElement('canvas');
    const size = 128;
    canvas.width = canvas.height = size;
    const context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.font = 'bold 48px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(value.toString(), size / 2, size / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(1, 1, 1);
    sprite.position.y = 0.6;
    mesh.add(sprite);
  }

  return mesh;
}

export function spawnRandomTile(grid) {
  const empty = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (grid[y][x] === 0) empty.push({ x, y });
    }
  }
  if (empty.length === 0) return;
  const { x, y } = empty[Math.floor(Math.random() * empty.length)];
  grid[y][x] = Math.random() < 0.9 ? 2 : 4;
}

export { GRID_SIZE };
