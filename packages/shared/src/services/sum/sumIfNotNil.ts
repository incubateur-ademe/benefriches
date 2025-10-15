export const sumIfNotNil = (
  a: number | null | undefined,
  b: number | null | undefined,
): number | undefined => {
  return a && b ? a + b : undefined;
};
