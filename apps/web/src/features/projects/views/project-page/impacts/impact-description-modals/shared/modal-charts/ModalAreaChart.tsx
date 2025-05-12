import Tooltip from "@codegouvfr/react-dsfr/Tooltip";

import {
  formatCO2Impact,
  formatDefaultImpact,
  formatETPImpact,
  formatSurfaceAreaImpact,
} from "@/features/projects/views/shared/formatImpactValue";
import { getPositiveNegativeTextClassesFromValue } from "@/shared/views/classes/positiveNegativeTextClasses";

import ImpactAreaChart from "../../../charts-view/ImpactChartCard/ImpactAreaChart";

type Props = {
  title: string;
  base: number;
  forecast: number;
  difference: number;
  color?: string;
  details?: { label: string; base: number; forecast: number; difference: number; color?: string }[];
  type?: "co2" | "surfaceArea" | "etp" | "default";
};

const impactTypeFormatterFn = {
  co2: formatCO2Impact,
  surfaceArea: formatSurfaceAreaImpact,
  etp: formatETPImpact,
  default: formatDefaultImpact,
} as const;

const ModalAreaChart = (props: Props) => {
  const { base, forecast, difference, color, details, title, type = "default" } = props;
  const formatFn = impactTypeFormatterFn[type];

  const data = details?.filter(({ difference }) => difference !== 0) ?? [
    {
      label: title,
      base,
      forecast,
      difference,
      color,
    },
  ];

  return (
    <Tooltip
      kind="hover"
      title={
        <div className="!tw-text-xs">
          {data.map(({ label, difference, color }) => (
            <div
              key={label}
              className="tw-py-1 tw-flex tw-justify-between tw-items-center tw-gap-2"
            >
              <div className="tw-flex tw-items-center tw-gap-2">
                <span
                  className="tw-min-h-3 tw-min-w-3 tw-rounded"
                  style={color ? { backgroundColor: color } : {}}
                ></span>
                <span>{label}</span>
              </div>

              <span className={getPositiveNegativeTextClassesFromValue(difference)}>
                {formatFn(difference)}
              </span>
            </div>
          ))}
        </div>
      }
    >
      <ImpactAreaChart height={300} {...props} />
    </Tooltip>
  );
};

export default ModalAreaChart;
