export const typedObjectKeys = <Obj extends object>(obj: Obj): (keyof Obj)[] => {
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return Object.keys(obj) as (keyof Obj)[];
};
