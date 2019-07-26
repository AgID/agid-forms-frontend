export function intersection<T>(
  arrA: ReadonlyArray<T>,
  arrB: ReadonlyArray<T>
): ReadonlyArray<T> {
  return arrA.filter(x => arrB.includes(x));
}
