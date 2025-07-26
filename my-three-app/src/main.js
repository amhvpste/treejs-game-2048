import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Game2048 } from './game.js';

let camera, scene, renderer, controls, game;

const scoreboard = document.getElementById('score');
const finalScore = document.getElementById('final-score');
const highScoreElem = document.getElementById('high-score');

function updateScore(score) {
  scoreboard.textContent = score;
  const highScore = localStorage.getItem('highScore') || 0;
  if (score > highScore) {
    localStorage.setItem('highScore', score);
    if (highScoreElem) highScoreElem.textContent = score;
  } else {
    if (highScoreElem) highScoreElem.textContent = highScore;
  }
}

export function startGame() {
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('game-over-screen').style.display = 'none';

  if (!game) {
    init();
  }

  game.init();
  updateScore(0);
}

export function restartGame() {
  document.getElementById('game-over-screen').style.display = 'none';
  game.init();
  updateScore(0);
}

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  // Додаємо сітку
  const gridHelper = new THREE.GridHelper(4, 4, 0x888888, 0xcccccc);
  gridHelper.position.set(0, 0, -0.11);
  gridHelper.rotation.x = Math.PI / 2;  // повертаємо сітку горизонтально
  scene.add(gridHelper);


  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(6, 4, 3); // Камера вправо і зверху
  scene.rotation.y = Math.PI / 6; 
  camera.lookAt(0, 0, 0);
  

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 5);
  scene.add(light);

  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  game = new Game2048(scene, updateScore, onGameOver);

  window.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowLeft': game.move(-1, 0); break;
      case 'ArrowRight': game.move(1, 0); break;
      case 'ArrowUp': game.move(0, -1); break;
      case 'ArrowDown': game.move(0, 1); break;
    }
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  animate();
}

let lastTime = 0;
function animate(time = 0) {
  requestAnimationFrame(animate);

  const delta = (time - lastTime) / 1000;
  lastTime = time;

  controls.update();
  if (game) game.update(delta);

  renderer.render(scene, camera);
}

function onGameOver(score) {
  document.getElementById('final-score').textContent = score;
  document.getElementById('game-over-screen').style.display = 'block';

  const highScore = localStorage.getItem('highScore') || 0;
  if (highScoreElem) highScoreElem.textContent = highScore;
}
