type Comparable = string | number | Date;

export function sortByKey<T extends object, K extends keyof T>(
  arr: T[],
  key: K & (T[K] extends Comparable ? K : never),
): T[] {
  return arr.toSorted((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
  });
}
