export function exponentialMovingAverage(
  data: number[],
  alpha: number = 0.3
): number[] {
  if (data.length === 0) return [];

  const result = [data[0]];
  for (let i = 1; i < data.length; i++) {
    result.push(alpha * data[i] + (1 - alpha) * result[i - 1]);
  }
  return result;
}

export function clampValue(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
