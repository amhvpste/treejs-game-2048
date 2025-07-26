import * as THREE from 'three';

export class Tile {
  constructor(value, x, y) {
    this.value = value;
    this.x = x;
    this.y = y;
    this.merged = false;

    const geometry = new THREE.BoxGeometry(0.9, 0.9, 0.2);
    const color = new THREE.Color(`hsl(${Math.log2(value) * 40}, 80%, 60%)`);
    const material = new THREE.MeshPhongMaterial({ color });
    this.mesh = new THREE.Mesh(geometry, material);

    this.sprite = this.createTextSprite(value);
    this.mesh.add(this.sprite);

    this.targetPos = new THREE.Vector3(this.x - 1.5, 1.5 - this.y, 0);
    this.mesh.position.copy(this.targetPos);
  }

  updateValue(newValue) {
    this.value = newValue;
    this.mesh.material.color.setHSL(Math.log2(newValue) * 40 / 360, 0.8, 0.6);
    this.mesh.remove(this.sprite);
    this.sprite = this.createTextSprite(newValue);
    this.mesh.add(this.sprite);
  }

  createTextSprite(text) {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'black';
    context.font = '48px sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(0.8, 0.8, 1);
    sprite.position.z = 0.51;

    return sprite;
  }

  moveTo(x, y) {
    this.x = x;
    this.y = y;
    this.targetPos.set(x - 1.5, 1.5 - y, 0);
  }

  update(delta) {
    this.mesh.position.lerp(this.targetPos, delta * 10);
  }
}
