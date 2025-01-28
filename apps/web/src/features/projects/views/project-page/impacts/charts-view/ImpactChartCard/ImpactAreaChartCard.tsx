import { Tooltip } from "@codegouvfr/react-dsfr/Tooltip";
import { roundTo1Digit, roundToInteger } from "shared";

import { getPercentageDifference } from "@/shared/core/percentage/percentage";
import classNames from "@/shared/views/clsx";

import {
  formatCO2Impact,
  formatDefaultImpact,
  formatSurfaceAreaImpact,
} from "../../../../shared/formatImpactValue";
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
    formatFn: formatDefaultImpact,
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
  onClick: () => void;
  impact: {
    impactLabel: string;
    base: number;
    forecast: number;
    difference: number;
    details?: { impactLabel: string; base: number; forecast: number; color?: string }[];
  };
  type?: AllowedImpactType;
};

function ImpactAreaChartCard({ type = "default", impact, onClick }: Props) {
  const { details, base, forecast, impactLabel } = impact;
  const percentageVariation = getPercentageDifference(base, forecast);

  const { formatFn, unitSuffix } = impactTypeFormatterMap[type];

  const baseValueText = `${formatFn(impact.base, { withSignPrefix: false })} ${unitSuffix}`;
  const forecastValueText = `${formatFn(impact.forecast, { withSignPrefix: false })} ${unitSuffix}`;

  const data = details ?? [
    {
      impactLabel,
      base,
      forecast,
    },
  ];

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      tabIndex={0}
      onKeyUp={(e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === "Enter") {
          onClick();
        }
      }}
      className={classNames(
        "tw-p-6",
        "tw-m-0",
        "tw-mb-8",
        "tw-rounded-2xl",
        "tw-bg-white",
        "dark:tw-bg-black",
        "tw-border",
        "tw-border-solid",
        "tw-border-transparent",
        "tw-cursor-pointer",
        "hover:tw-border-current",
        "tw-transition tw-ease-in-out tw-duration-500",
      )}
    >
      <div className="tw-flex tw-justify-between tw-items-start">
        <h4 className="tw-text-xl tw-mb-1">{impactLabel}</h4>
        <ImpactPercentageVariation
          percentage={percentageVariation > 10000 ? 9999 : percentageVariation}
        />
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
    </div>
  );
}

export default ImpactAreaChartCard;
