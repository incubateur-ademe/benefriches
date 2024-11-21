export const sumObjectValues = (obj: Record<string, number>) => {
  return Object.values(obj)
    .filter((amount) => !!amount)
    .reduce((sum, amount) => sum + amount, 0);
};

export const sumList = (list: number[]): number => {
  return list.reduce((sum, amount) => sum + amount, 0);
};

type ObjNumericKeys<K extends string> = {
  [key in K]: number;
};
export function sumListWithKey<K extends string, T extends ObjNumericKeys<K>>(
  list: T[],
  key: K,
): number {
  return list.reduce((sum, item) => {
    const value = item[key];
    return sum + value;
  }, 0);
}
