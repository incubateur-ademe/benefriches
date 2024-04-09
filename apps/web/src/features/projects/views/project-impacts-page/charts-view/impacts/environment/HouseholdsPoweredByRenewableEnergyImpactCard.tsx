import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import ImpactCard from "../../ImpactChartCard";

import { baseAreaChartConfig } from "@/features/projects/views/shared/sharedChartConfig.ts";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { roundTo2Digits } from "@/shared/services/round-numbers/roundNumbers";

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
      categories: ["Pas de changement", reconversionProjectName],
    },
    plotOptions: {
      area: {
        borderWidth: 0,
      },
    },
    series: [
      {
        name: "Foyers alimentés par les EnR",
        type: "area",
        data: [
          roundTo2Digits(householdsPoweredByRenewableEnergy.current),
          roundTo2Digits(householdsPoweredByRenewableEnergy.forecast),
        ],
        showInLegend: false,
      },
    ],
  };

  return (
    <ImpactCard title="🏠 Foyers alimentés par les EnR" onTitleClick={onTitleClick}>
      <div style={{ textAlign: "center" }}>
        + {formatNumberFr(roundTo2Digits(householdsPoweredByRenewableEnergy.forecast))} foyers
      </div>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </ImpactCard>
  );
}

export default HouseholdsPoweredByRenewableEnergyImpactCard;
