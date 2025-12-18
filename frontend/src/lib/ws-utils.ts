export function getRandomPosition(maxVal: number) {
  const random = Math.floor(Math.random() * maxVal);

  return random - (random % 32);
};
