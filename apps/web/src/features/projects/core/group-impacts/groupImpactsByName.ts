import { sumListWithKey } from "shared";

import { filterByName } from "@/shared/core/filter-by-name/filterByName";

export function groupImpactsByName<
  T extends { name: string; total: number },
  G extends string,
  N extends T["name"],
>(items: readonly T[], groupName: G, ...names: N[]) {
  const details = filterByName(items, ...names).map((item) => ({
    name: item.name,
    total: item.total,
    keyName: `${groupName}.${item.name}` as const,
  }));

  return {
    total: sumListWithKey(details, "total"),
    details,
    keyName: groupName,
  };
}
