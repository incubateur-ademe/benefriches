import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import ImpactAbsoluteVariation from "../../ImpactChartCard/ImpactAbsoluteVariation";
import ImpactCard from "../../ImpactChartCard/ImpactChartCard";
import ImpactPercentageVariation from "../../ImpactChartCard/ImpactPercentageVariation";

import { formatDefaultImpact } from "@/features/projects/views/shared/formatImpactValue";
import { baseAreaChartConfig } from "@/features/projects/views/shared/sharedChartConfig.ts";
import { roundToInteger } from "@/shared/services/round-numbers/roundNumbers";

type Props = {
  reconversionProjectName: string;
  householdsPoweredByRenewableEnergy: {
    current: number;
    forecast: number;
  };
  onTitleClick: () => void;
};

function HouseholdsPoweredByRenewableEnergyImpactCard({
  reconversionProjectName,
  householdsPoweredByRenewableEnergy,
  onTitleClick,
}: Props) {
  const barChartOptions: Highcharts.Options = {
    ...baseAreaChartConfig,
    xAxis: {
      labels: { enabled: false },
      categories: ["Pas de changement", reconversionProjectName],
    },
    series: [
      {
        name: "Foyers alimentés par les EnR",
        type: "area",
        data: [
          roundToInteger(householdsPoweredByRenewableEnergy.current),
          roundToInteger(householdsPoweredByRenewableEnergy.forecast),
        ],
        showInLegend: false,
      },
    ],
  };

  return (
    <ImpactCard title="🏠 Foyers alimentés par les EnR" onTitleClick={onTitleClick}>
      <ImpactPercentageVariation percentage={100} />
      <ImpactAbsoluteVariation>
        {formatDefaultImpact(roundToInteger(householdsPoweredByRenewableEnergy.forecast))} foyers
      </ImpactAbsoluteVariation>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </ImpactCard>
  );
}

export default HouseholdsPoweredByRenewableEnergyImpactCard;
