import { Tile } from './Tile.js';

export function createBoard(scene, font) {
  const size = 4;
  const spacing = 1.1;
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      const tile = new Tile(2, font);
      tile.mesh.position.set(x * spacing, 0, y * spacing);
      scene.add(tile.mesh);
    }
  }
}