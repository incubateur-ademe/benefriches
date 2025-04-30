import { Tooltip } from "@codegouvfr/react-dsfr/Tooltip";
import { roundTo1Digit, roundToInteger } from "shared";

import { getPercentageDifference } from "@/shared/core/percentage/percentage";

import {
  formatCO2Impact,
  formatDefaultImpact,
  formatETPImpact,
  formatSurfaceAreaImpact,
} from "../../../../shared/formatImpactValue";
import ImpactsChartCard, { ChartCardProps } from "./ImpactChartCard";
import ImpactChartTooltipContent from "./ImpactChartTooltipContent";
import ImpactColoredAreaChart from "./ImpactColoredAreaChart";
import ImpactPercentageVariation from "./ImpactPercentageVariation";

const impactTypeFormatterMap = {
  co2: {
    roundFn: roundToInteger,
    formatFn: formatCO2Impact,
    unitSuffix: "",
  },
  surfaceArea: {
    roundFn: roundTo1Digit,
    formatFn: formatSurfaceAreaImpact,
    unitSuffix: "",
  },
  etp: {
    roundFn: roundTo1Digit,
    formatFn: formatETPImpact,
    unitSuffix: "ETP",
  },
  default: {
    roundFn: roundToInteger,
    formatFn: formatDefaultImpact,
    unitSuffix: "",
  },
} as const;

type AllowedImpactType = keyof typeof impactTypeFormatterMap;

type Props = {
  baseLabel?: string;
  forecastLabel?: string;
  impact: {
    impactLabel: string;
    base: number;
    forecast: number;
    difference: number;
    color?: string;
    details?: { impactLabel: string; base: number; forecast: number; color?: string }[];
  };
  type?: AllowedImpactType;
} & ChartCardProps;

function ImpactAreaChartCard({ type = "default", impact, dialogId }: Props) {
  const { details, base, forecast, impactLabel, color = "#22AFE5" } = impact;
  const percentageVariation = getPercentageDifference(base, forecast);

  const { formatFn, unitSuffix } = impactTypeFormatterMap[type];

  const baseValueText = `${formatFn(impact.base, { withSignPrefix: false })} ${unitSuffix}`;
  const forecastValueText = `${formatFn(impact.forecast, { withSignPrefix: false })} ${unitSuffix}`;

  const data = details?.filter(({ forecast, base }) => forecast - base !== 0) ?? [
    {
      impactLabel,
      base,
      forecast,
      color,
    },
  ];

  return (
    <ImpactsChartCard dialogId={dialogId}>
      <div className="tw-flex tw-justify-between tw-items-start">
        <h4 className="tw-text-xl tw-mb-1">{impactLabel}</h4>
        {base !== 0 && (
          <ImpactPercentageVariation
            percentage={percentageVariation > 10000 ? 9999 : percentageVariation}
          />
        )}
      </div>

      <Tooltip
        kind="hover"
        title={
          <ImpactChartTooltipContent
            rows={data.map(({ impactLabel, base, forecast, color }) => ({
              label: impactLabel,
              value: forecast - base,
              valueText: impactTypeFormatterMap[type].formatFn(forecast - base),
              color,
            }))}
          />
        }
      >
        <ImpactColoredAreaChart
          categoryLabels={[
            `<strong>Sans le projet</strong><br>${baseValueText}`,
            `<strong>Avec le projet</strong><br>${forecastValueText}`,
          ]}
          data={data.map((data) => ({
            label: data.impactLabel,
            color: data.color,
            values: [
              impactTypeFormatterMap[type].roundFn(data.base),
              impactTypeFormatterMap[type].roundFn(data.forecast),
            ],
          }))}
        />
      </Tooltip>
    </ImpactsChartCard>
  );
}

export default ImpactAreaChartCard;
