import { typedObjectKeys } from "shared";

export const isObjectsEqual = (a: object, b: object) => {
  const previousDistributionKeys = typedObjectKeys(a);
  const nextDistributionKeys = typedObjectKeys(b);

  return (
    previousDistributionKeys.length === nextDistributionKeys.length &&
    nextDistributionKeys.every((key) => a[key] === b[key]) &&
    previousDistributionKeys.every((key) => a[key] === b[key])
  );
};
