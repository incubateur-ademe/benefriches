export function filterNonEmptyImpacts<T extends { total: number; details?: readonly unknown[] }>(
  items: readonly T[],
): T[] {
  return items.filter((item) => (item.details ? item.details.length !== 0 : item.total !== 0));
}
