export function filterByName<T extends { name: string }, N extends T["name"]>(
  items: readonly T[] | null | undefined,
  ...names: N[]
): (T & { name: N })[] {
  const nameSet = new Set<string>(names);
  return (items ?? []).filter((item): item is T & { name: N } => nameSet.has(item.name));
}
