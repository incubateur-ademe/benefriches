import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { baseAreaChartConfig } from "../../../shared/sharedChartConfig";
import ImpactCard from "../../ImpactChartCard";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { roundTo2Digits } from "@/shared/services/round-numbers/roundNumbers";

type Props = {
  reconversionProjectName: string;
  householdsPoweredByRenewableEnergy: {
    current: number;
    forecast: number;
  };
};

function HouseholdsPoweredByRenewableEnergyImpactCard({
  reconversionProjectName,
  householdsPoweredByRenewableEnergy,
}: Props) {
  const barChartOptions: Highcharts.Options = {
    ...baseAreaChartConfig,
    xAxis: {
      categories: ["Pas de changement", reconversionProjectName],
    },
    yAxis: {
      visible: false,
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
    <ImpactCard title="🏠 Foyers alimentés par les EnR">
      <div style={{ textAlign: "center" }}>
        + {formatNumberFr(roundTo2Digits(householdsPoweredByRenewableEnergy.forecast))} foyers
      </div>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </ImpactCard>
  );
}

export default HouseholdsPoweredByRenewableEnergyImpactCard;
