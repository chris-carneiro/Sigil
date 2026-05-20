export async function withMinimumDuration<T>(
  promise: Promise<T>,
  ms: number
): Promise<T> {
  const [result] = await Promise.all([
    promise,
    new Promise(resolve => setTimeout(resolve, ms))
  ]);
  return result;
}