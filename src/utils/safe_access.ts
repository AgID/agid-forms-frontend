/**
 * Forked from https://github.com/salesforce/ts-safe-access
 * see also https://stackoverflow.com/questions/52064027/how-can-i-write-a-recursive-nonnullable-type-in-typescript
 *
 * Adds: correct typings
 */

const RNN_ORIG = Symbol();
type RecursiveNonNullable1<T> = { [K in keyof T]: RecursiveNonNullable<T[K]> };
type RecursiveNonNullable<T> = RecursiveNonNullable1<NonNullable<T>> & {
  [RNN_ORIG]: T;
};

// tslint:disable-next-line: no-commented-code
// type StrictlyRequired<T> = {
//   [P in keyof T]-?: T[P] extends object
//     ? NonNullable<StrictlyRequired<T[P]>>
//     : NonNullable<T[P]>;
// };

export function get<T, R extends { [RNN_ORIG]: unknown }>(
  obj: T,
  fn: (obj: RecursiveNonNullable<T>) => R,
  defaultValue?: Omit<R, typeof RNN_ORIG>,
  excludeNull = false
) {
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
