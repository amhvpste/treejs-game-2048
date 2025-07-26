import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

export class Tile {
  constructor(value, x, y, scene, font) {
    this.value = value;
    this.x = x;
    this.y = y;
    this.scene = scene;
    this.font = font;
    this.mesh = this.createTile();
    this.scene.add(this.mesh);
  }

  createTile() {
    const group = new THREE.Group();
    const size = 1;
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshStandardMaterial({ color: this.getColor() });
    const cube = new THREE.Mesh(geometry, material);
    group.add(cube);

    if (this.font) {
      const textGeo = new THREE.TextGeometry(this.value.toString(), {
        font: this.font,
        size: 0.3,
        height: 0.05
      });
      const textMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const textMesh = new THREE.Mesh(textGeo, textMat);
      textGeo.computeBoundingBox();
      const box = textGeo.boundingBox;
      const textWidth = box.max.x - box.min.x;
      const textHeight = box.max.y - box.min.y;
      textMesh.position.set(-textWidth / 2, -textHeight / 2, 0.51);
      group.add(textMesh);
    }

    group.position.set(this.x - 1.5, this.y - 1.5, 0);
    return group;
  }

  updatePosition(x, y) {
    this.x = x;
    this.y = y;
    this.mesh.position.set(this.x - 1.5, this.y - 1.5, 0);
  }

  remove() {
    this.scene.remove(this.mesh);
  }

  getColor() {
    const colors = {
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
    return colors[this.value] || 0x3c3a32;
  }
}
