import { Link } from "type-route";

import {
  EconomicBalanceDetailsImpactKeyName,
  EconomicBalanceMainImpactKeyName,
} from "@/features/projects/core/projectImpactsEconomicBalance";
import {
  EnvironmentalImpactMetricDetailsKeyName,
  EnvironmentalImpactMetricMainKeyName,
} from "@/features/projects/core/projectImpactsEnvironmental";
import {
  SocialImpactMetricDetailsKeyName,
  SocialImpactMetricMainKeyName,
} from "@/features/projects/core/projectImpactsSocial";
import {
  SocioEconomicImpactDetailsImpactKeyName,
  SocioEconomicImpactMainImpactKeyName,
} from "@/features/projects/core/projectImpactsSocioEconomic";

export type SplitKey<K extends string> = K extends `${infer Parent}.${infer Child}`
  ? [Parent, Child]
  : [K];

export const splitImpactKey = <K extends string>(key: K): SplitKey<K> => {
  return key.split(".") as SplitKey<K>;
};

type ImpactMainKeyName =
  | EconomicBalanceMainImpactKeyName
  | SocioEconomicImpactMainImpactKeyName
  | SocialImpactMetricMainKeyName
  | EnvironmentalImpactMetricMainKeyName;

type ImpactDetailsKeyName =
  | EconomicBalanceDetailsImpactKeyName
  | SocioEconomicImpactDetailsImpactKeyName
  | SocialImpactMetricDetailsKeyName
  | EnvironmentalImpactMetricDetailsKeyName;

export type ImpactKeyName = ImpactMainKeyName | ImpactDetailsKeyName;

type ExtractDetailsKey<K extends string> = K extends `${string}.${string}` ? K : never;

type ImpactWithDetails<DetailsKey extends ImpactDetailsKeyName> = {
  keyName: string;
  total: number;
  breakdown?: { base: number; forecast: number };
  details?: {
    keyName: DetailsKey;
    total: number;
    breakdown?: { base: number; forecast: number };
  }[];
};

export type ExtractedImpactData<DetailsKey extends ImpactDetailsKeyName> = {
  total: number;
  bearerName?: string;
  breakdown?: { base: number; forecast: number };
  color?: string;

  details?: {
    label: string;
    color?: string;
    value: number;
    breakdown?: { base: number; forecast: number };
    name: DetailsKey;
    linkProps: Link | undefined;
  }[];
};

export const getImpactModalData = <Key extends ImpactKeyName>(
  items: ImpactWithDetails<ExtractDetailsKey<Key>>[],
  keyName: Key,
  {
    getLabel,
    getColor,
    getLinkProps,
  }: {
    getLabel: (key: ExtractDetailsKey<Key>) => string;
    getColor: (key: Key) => string | undefined;
    getLinkProps: (key: ExtractDetailsKey<Key>) => Link | undefined;
  },
): ExtractedImpactData<ExtractDetailsKey<Key>> | undefined => {
  const [impactKeyName, impactDetailsKeyName] = splitImpactKey(keyName);

  if (impactDetailsKeyName) {
    const impact = items.find((item) => item.keyName === impactKeyName);
    const total = impact?.details?.find((d) => d.keyName === keyName)?.total;
    return total !== undefined ? { total } : undefined;
  }

  const impact = items.find((item) => item.keyName === keyName);

  if (!impact) {
    return undefined;
  }

  return {
    ...impact,
    color: getColor(keyName),
    details: impact.details?.map((d) => ({
      label: getLabel(d.keyName),
      color: getColor(d.keyName),
      value: d.total,
      breakdown: d.breakdown,
      name: d.keyName,
      linkProps: getLinkProps(d.keyName),
    })),
  };
};
