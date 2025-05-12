import { getPercentageDifference } from "@/shared/core/percentage/percentage";

import ImpactAreaChart, { ImpactAreaChartProps } from "./ImpactAreaChart";
import ImpactsChartCard, { ChartCardProps } from "./ImpactChartCard";
import ImpactPercentageVariation from "./ImpactPercentageVariation";

type Props = {
  title: string;
  base: number;
  forecast: number;
  difference: number;
} & ChartCardProps &
  ImpactAreaChartProps;

function ImpactAreaChartCard({ title, dialogId, ...rest }: Props) {
  const percentageVariation = getPercentageDifference(rest.base, rest.forecast);

  return (
    <ImpactsChartCard dialogId={dialogId}>
      <div className="tw-flex tw-justify-between tw-items-start">
        <h4 className="tw-text-xl tw-mb-1">{title}</h4>
        {rest.base !== 0 && (
          <ImpactPercentageVariation
            percentage={percentageVariation > 10000 ? 9999 : percentageVariation}
          />
        )}
      </div>
      <ImpactAreaChart title={title} {...rest} />
    </ImpactsChartCard>
  );
}

export default ImpactAreaChartCard;
