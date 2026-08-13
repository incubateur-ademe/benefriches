export function findTotalByName(
  items: readonly { name: string; total: number }[],
  name: string,
): number {
  return items.find((item) => item.name === name)?.total ?? 0;
}
