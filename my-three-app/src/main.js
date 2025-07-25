import * as THREE from 'three';
import { createGrid, updateGridVisuals } from './grid.js';
import { handleKeyPress } from './controls.js';

const scene = new THREE.Scene();

// Камера: вузький кут і ближче до сцени
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 6, 6);
camera.lookAt(0, 0, 0); // центр фокусу — в нуль

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(800, 600);
document.body.appendChild(renderer.domElement);

// Світло
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 3, 5);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Підлога: зміщена на 0,0 і відцентрована
const floorGeometry = new THREE.PlaneGeometry(4, 4);
floorGeometry.translate(0, 0, 0); // перенести в центр
const floorMaterial = new THREE.MeshPhongMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// Грати по центру
const grid = createGrid(scene);

if (grid instanceof THREE.Object3D) {
  grid.position.set(0, 0, 0); // переконатись, що в центрі
  grid.scale.set(0.5, 0.5, 0.5);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

window.addEventListener('keydown', (e) => handleKeyPress(e, grid, scene));