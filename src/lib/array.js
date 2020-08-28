export function swap(array, a, b) {
  [array[a], array[b]] = [array[b], array[a]];
  return array;
}

export function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)]; //The maximum is exclusive and the minimum is inclusive
}
