import { typedObjectEntries } from "../../object-entries";

export const filterObjectWithoutKeys = <T extends object>(
  obj: T,
  keys: (keyof T)[],
): Partial<T> => {
  return Object.fromEntries(
    typedObjectEntries(obj).filter(([key]) => !keys.includes(key)),
  ) as Partial<T>;
};
