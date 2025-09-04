const DEG = Math.PI / 180;

export function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

/** favor 3/4 views; avoid perfect front/top/side */
export function randomReadableEuler(): [number, number, number] {
  const yaw = rand(20 * DEG, 70 * DEG) * (Math.random() < 0.5 ? 1 : -1);
  const pitch = rand(10 * DEG, 25 * DEG) * (Math.random() < 0.5 ? 1 : -1);
  const roll = rand(-5 * DEG, 5 * DEG);
  return [pitch, yaw, roll];
}
