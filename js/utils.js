function getRandomInt(min, max) {
  // 최댓값은 제외, 최솟값은 포함
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}