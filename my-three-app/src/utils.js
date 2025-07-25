export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function getRandomPosition(gridSize) {
  return {
    x: getRandomInt(0, gridSize),
    y: getRandomInt(0, gridSize)
  };
}