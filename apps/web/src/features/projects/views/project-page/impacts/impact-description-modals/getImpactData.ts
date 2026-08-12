import {
  EconomicBalanceDetailsImpactKeyName,
  EconomicBalanceImpactKeyName,
} from "@/features/projects/core/projectImpactsEconomicBalance";
import {
  SocialImpactMetricDetailsKeyName,
  SocialImpactMetricKeyName,
} from "@/features/projects/core/projectImpactsSocial";
import {
  SocioEconomicDetailsName,
  SocioEconomicImpactImpactKeyName,
} from "@/features/projects/core/projectImpactsSocioEconomic";

export type SplitKey<K extends string> = K extends `${infer Parent}.${infer Child}`
  ? [Parent, Child]
  : [K];

export const splitImpactKey = <K extends string>(key: K): SplitKey<K> => {
  return key.split(".") as SplitKey<K>;
};
type ImpactKeyName =
  | EconomicBalanceImpactKeyName
  | SocioEconomicImpactImpactKeyName
  | SocialImpactMetricKeyName;

type ImpactDetailsKeyName =
  | EconomicBalanceDetailsImpactKeyName
  | SocioEconomicDetailsName
  | SocialImpactMetricDetailsKeyName;

type ImpactWithDetails<DetailsKey extends ImpactDetailsKeyName> = {
  keyName: string;
  total: number;
  details?: { keyName: DetailsKey; total: number }[];
};

export type ExtractedImpactData<DetailsKey extends ImpactDetailsKeyName> = {
  total: number;
  bearerName?: string;
  details?: {
    label: string;
    color: string;
    value: number;
    name: DetailsKey;
    onClick: () => void;
  }[];
};

export const getImpactModalData = <DetailsKey extends ImpactDetailsKeyName>(
  items: ImpactWithDetails<DetailsKey>[],
  keyName: ImpactKeyName,
  {
    getLabel,
    getColor,
    onClick,
  }: {
    getLabel: (key: DetailsKey) => string;
    getColor: (key: DetailsKey) => string;
    onClick: (key: DetailsKey) => void;
  },
): ExtractedImpactData<DetailsKey> | undefined => {
  const [impactKeyName, impactDetailsKeyName] = splitImpactKey(keyName);

  if (impactDetailsKeyName) {
    const impact = items.find((item) => item.keyName === impactKeyName);
    const total = impact?.details?.find((d) => d.keyName === keyName)?.total;
    return total ? { total } : undefined;
  }

  const impact = items.find((item) => item.keyName === keyName);

  if (!impact) {
    return undefined;
  }

  return {
    ...impact,
    details: impact.details?.map(({ total, keyName }) => ({
      label: getLabel(keyName),
      color: getColor(keyName) ?? "",
      value: total,
      name: keyName,
      onClick: () => {
        onClick(keyName);
      },
    })),
  };
};
