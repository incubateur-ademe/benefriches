import type { ReactNode } from "react";
import type { Link } from "type-route";

import type {
  EconomicBalanceDetailsImpactKeyName,
  EconomicBalanceMainImpactKeyName,
} from "@/features/projects/core/projectImpactsEconomicBalance";
import type {
  EnvironmentalImpactMetricDetailsKeyName,
  EnvironmentalImpactMetricMainKeyName,
} from "@/features/projects/core/projectImpactsEnvironmental";
import type {
  SocialImpactMetricDetailsKeyName,
  SocialImpactMetricMainKeyName,
} from "@/features/projects/core/projectImpactsSocial";
import type {
  SocioEconomicImpactDetailsImpactKeyName,
  SocioEconomicImpactMainImpactKeyName,
} from "@/features/projects/core/projectImpactsSocioEconomic";

import type { ImpactAreaChartProps } from "../shared/charts/useImpactAreaChartProps";
import type { ModalColumnPointChartProps } from "./modal-charts/ModalColumnPointChart";
import type { ModalHeaderDataProps } from "./modal-layout/ModalHeader";
import type { ModalTableProps } from "./modal-table/ModalTable";

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

type ImpactKeyName = ImpactMainKeyName | ImpactDetailsKeyName;

type ExtractDetailsKey<K extends string> = K extends `${string}.${string}` ? K : never;

type ImpactWithDetails<DetailsKey extends ImpactDetailsKeyName> = {
  keyName: string;
  total: number;
  bearerName?: string;
  breakdown?: { base: number; forecast: number };
  details?: {
    keyName: DetailsKey;
    total: number;
    breakdown?: { base: number; forecast: number };
  }[];
};

const getHeaderValueProps = (
  value: number,
  bearerName: string | undefined,
  config: {
    formatFn: (value: number) => string;
    description?: string;
    unit?: string;
  },
): ModalHeaderDataProps["headerProps"]["value"] | undefined => {
  if (value === 0) return undefined;
  return {
    state: value > 0 ? "success" : "error",
    text: `${config.formatFn(value)} ${config.unit ?? ""}`,
    description: config.description ?? (bearerName ? `pour ${bearerName}` : undefined),
  };
};

export const getImpactModalData = <Key extends ImpactKeyName>(
  items: ImpactWithDetails<ExtractDetailsKey<Key>>[],
  keyName: Key,
  {
    getLabel,
    getColor,
    getLinkProps,
    formatFn,
    description,
    unit,
    subtitle,
    caption,
  }: {
    getLabel: (key: ExtractDetailsKey<Key> | Key) => string;
    getColor: (key: Key) => string | undefined;
    getLinkProps: (key: ExtractDetailsKey<Key>) => Link | undefined;
    formatFn: (value: number) => string;
    description?: string;
    unit?: string;
    subtitle?: ReactNode;
    caption?: string;
  },
): ModalHeaderDataProps | undefined => {
  const [impactKeyName, impactDetailsKeyName] = splitImpactKey(keyName);

  if (impactDetailsKeyName) {
    const impact = items.find((item) => item.keyName === impactKeyName);
    const total = impact?.details?.find((d) => d.keyName === keyName)?.total;

    if (!total) {
      return undefined;
    }
    const headerProps = getHeaderValueProps(total, impact.bearerName, {
      formatFn,
      description,
      unit,
    });
    if (!headerProps) {
      return undefined;
    }
    return {
      type: "value",
      headerProps: {
        subtitle,
        value: headerProps,
      },
    };
  }

  const impact = items.find((item) => item.keyName === keyName);

  if (!impact) {
    return undefined;
  }

  const headerPropsValue = getHeaderValueProps(impact.total, impact.bearerName, {
    formatFn,
    description,
  });

  const headerProps = {
    subtitle,
    value: headerPropsValue,
  };
  const data = {
    ...impact,
    color: getColor(keyName),
    title: getLabel(keyName),
    details: impact.details?.map((d) => ({
      label: getLabel(d.keyName),
      color: getColor(d.keyName),
      value: d.total,
      breakdown: d.breakdown,
      name: d.keyName,
      linkProps: getLinkProps(d.keyName),
    })),
  };

  if (data.details && data.breakdown) {
    return {
      type: "area",
      headerProps,
      tableProps: { data: data.details, formatFn, caption },
      chartProps: {
        base: data.breakdown.base,
        forecast: data.breakdown.forecast,
        difference: impact.total,
        title: getLabel(keyName),
        color: getColor(keyName),
        details: data.details?.map((item) => ({
          ...item,
          base: item.breakdown?.base ?? 0,
          forecast: item.breakdown?.forecast ?? item.value,
          difference: item.value,
        })),
      } satisfies ImpactAreaChartProps,
    };
  }

  if (data.details) {
    return {
      type: "column",
      headerProps: headerProps,
      tableProps: { data: data.details, formatFn, caption } satisfies ModalTableProps,
      chartProps: {
        data: data.details,
        exportTitle: getLabel(keyName),
      } satisfies ModalColumnPointChartProps,
    };
  }

  return {
    type: "value",
    headerProps,
  };
};
