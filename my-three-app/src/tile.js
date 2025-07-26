import * as THREE from 'three';
import { CSG } from 'three-js-csg';

export class Tile {
  constructor(value, font) {
    this.value = value;
    this.mesh = this.createTileMesh(value, font);
  }

  createTileMesh(value, font) {
    const tileGeometry = new THREE.BoxGeometry(1, 1, 1);
    const tileMaterial = new THREE.MeshStandardMaterial({ color: 0xf5f5dc });
    const cube = new THREE.Mesh(tileGeometry, tileMaterial);

    const textGeometry = new THREE.TextGeometry(value.toString(), {
      font: font,
      size: 0.4,
      height: 0.05,
    });

    textGeometry.center();

    const textMaterial = new THREE.MeshStandardMaterial();
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(0, 0.5, 0);

    // Boolean вирізання
    const cubeCSG = CSG.fromMesh(cube);
    const textCSG = CSG.fromMesh(textMesh);
    const subtracted = CSG.subtract(cubeCSG, textCSG);
    return CSG.toMesh(subtracted, cube.matrixWorld, tileMaterial);
  }
}