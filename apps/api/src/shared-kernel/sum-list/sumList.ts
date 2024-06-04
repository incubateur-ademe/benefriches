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
