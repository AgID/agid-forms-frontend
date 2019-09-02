/**
 * Forked from https://github.com/salesforce/ts-safe-access
 * see also https://stackoverflow.com/questions/52064027/how-can-i-write-a-recursive-nonnullable-type-in-typescript
 *
 * Adds: correct typings
 */

type RecursiveNonNullable1<T> = { [K in keyof T]: RecursiveNonNullable<T[K]> };
type RecursiveNonNullable<T> = RecursiveNonNullable1<NonNullable<T>>;

export function get<T, R>(
  obj: T,
  fn: (obj: RecursiveNonNullable<T>) => R,
  defaultValue: R,
  excludeNull = false
): R {
  try {
    const result = fn(obj as any);
    const ret = excludeNull
      ? result === null
        ? defaultValue
        : result
      : result;
    return ret === undefined ? defaultValue : ret;
  } catch (err) {
    return defaultValue;
  }
}

export function has<T, R>(obj: T, getFn: (o: T) => R) {
  try {
    const result = getFn(obj);
    return result !== undefined;
  } catch (err) {
    return false;
  }
}
