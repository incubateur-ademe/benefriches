import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { baseAreaChartConfig } from "../../../shared/sharedChartConfig";
import ImpactCard from "../../ImpactChartCard";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { roundTo2Digits } from "@/shared/services/round-numbers/roundNumbers";

type Props = {
  reconversionProjectName: string;
  avoidedCO2TonsWithEnergyProduction: {
    current: number;
    forecast: number;
  };
};

function StoredAndAvoidedCO2ImpactCard({
  reconversionProjectName,
  avoidedCO2TonsWithEnergyProduction,
}: Props) {
  const barChartOptions: Highcharts.Options = {
    ...baseAreaChartConfig,
    xAxis: {
      categories: ["Pas de changement", reconversionProjectName],
      crosshair: false,
    },
    tooltip: {
      valueSuffix: `&nbsp; t`,
    },
    plotOptions: {
      area: {
        borderWidth: 0,
      },
    },
    series: [
      {
        name: "CO2-eq évité grâce à la production EnR",
        type: "area",
        data: [
          roundTo2Digits(avoidedCO2TonsWithEnergyProduction.current),
          roundTo2Digits(avoidedCO2TonsWithEnergyProduction.forecast),
        ],
        showInLegend: false,
      },
    ],
  };

  return (
    <ImpactCard title="☁️ CO2-eq stocké ou évité">
      <div style={{ textAlign: "center" }}>
        {formatNumberFr(avoidedCO2TonsWithEnergyProduction.forecast)}&nbsp;t
      </div>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </ImpactCard>
  );
}

export default StoredAndAvoidedCO2ImpactCard;
