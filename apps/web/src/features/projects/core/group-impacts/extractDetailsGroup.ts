import { sumListWithKey } from "shared";

import { filterByName } from "@/shared/core/filter-by-name/filterByName";

type DetailsSourceItem = { name: string; total: number };

type WithDetails<T> = Extract<T, { details: string }>;

export function extractDetailsGroup<T extends DetailsSourceItem, G extends WithDetails<T>["name"]>(
  items: readonly T[],
  groupName: G,
  options?: { bearerName?: string },
): {
  total: number;
  keyName: G;
  bearerName?: string;
  details: {
    name: Extract<WithDetails<T>, { name: G }>["details"];
    total: number;
    keyName: `${G}.${Extract<WithDetails<T>, { name: G }>["details"]}`;
  }[];
};

export function extractDetailsGroup<
  T extends DetailsSourceItem,
  G extends WithDetails<T>["name"],
  K extends string,
>(
  items: readonly T[],
  groupName: G,
  options: { keyGroupName: K; bearerName?: string },
): {
  total: number;
  keyName: K;
  bearerName?: string;
  details: {
    name: Extract<WithDetails<T>, { name: G }>["details"];
    total: number;
    keyName: `${K}.${Extract<WithDetails<T>, { name: G }>["details"]}`;
  }[];
};

export function extractDetailsGroup(
  items: readonly (DetailsSourceItem & { details?: string })[],
  groupName: string,
  options?: { keyGroupName?: string; bearerName?: string },
) {
  const keyGroupName = options?.keyGroupName ?? groupName;

  const details = filterByName(items, groupName).map((item) => ({
    name: item.details,
    total: item.total,
    keyName: `${keyGroupName}.${item.details}`,
  }));

  return {
    total: sumListWithKey(details, "total"),
    details,
    keyName: keyGroupName,
    ...(options && "bearerName" in options ? { bearerName: options.bearerName } : {}),
  };
}
