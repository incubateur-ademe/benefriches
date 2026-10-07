import { typedObjectEntries } from "../../object-entries";

export const filterObjectWithoutKeys = <T extends object>(
  obj: T,
  keys: (keyof T)[],
): Partial<T> => {
  return Object.fromEntries(
    typedObjectEntries(obj).filter(([key]) => !keys.includes(key)),
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  ) as Partial<T>;
};

export const filterObjectWithKeys = <T extends object>(obj: T, keys: (keyof T)[]): Partial<T> => {
  return Object.fromEntries(
    typedObjectEntries(obj).filter(([key]) => keys.includes(key)),
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  ) as Partial<T>;
};

type Entry<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T];

export const filterObject = <T extends object>(
  obj: T,
  fn: (entry: Entry<T>, i: number, arr: Entry<T>[]) => boolean,
) => {
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return Object.fromEntries((Object.entries(obj) as Entry<T>[]).filter(fn)) as Partial<T>;
};
