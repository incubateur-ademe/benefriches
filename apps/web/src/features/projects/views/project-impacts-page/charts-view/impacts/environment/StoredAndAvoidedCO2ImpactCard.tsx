import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import ImpactCard from "../../ImpactChartCard";

import { formatCO2Impact } from "@/features/projects/views/shared/formatImpactValue";
import { baseAreaChartConfig } from "@/features/projects/views/shared/sharedChartConfig.ts";
import { roundTo2Digits } from "@/shared/services/round-numbers/roundNumbers";

type Props = {
  reconversionProjectName: string;
  avoidedCO2TonsWithEnergyProduction: {
    current: number;
    forecast: number;
  };
  soilsCarbonStorage: {
    current: { total: number };
    forecast: { total: number };
  };
};

function StoredAndAvoidedCO2ImpactCard({
  reconversionProjectName,
  avoidedCO2TonsWithEnergyProduction,
  soilsCarbonStorage,
}: Props) {
  const barChartOptions: Highcharts.Options = {
    ...baseAreaChartConfig,
    xAxis: {
      labels: { enabled: false },
      categories: ["Pas de changement", reconversionProjectName],
    },
    tooltip: {
      valueSuffix: `&nbsp; t`,
    },
    plotOptions: {
      area: {
        borderWidth: 0,
        stacking: "normal",
      },
    },
    legend: { enabled: false },
    series: [
      {
        name: "CO2-eq évité grâce à la production EnR",
        type: "area",
        data: [
          roundTo2Digits(avoidedCO2TonsWithEnergyProduction.current),
          roundTo2Digits(avoidedCO2TonsWithEnergyProduction.forecast),
        ],
      },
      {
        name: "Carbone stocké par les sols",
        type: "area",
        data: [
          roundTo2Digits(soilsCarbonStorage.current.total),
          roundTo2Digits(soilsCarbonStorage.forecast.total),
        ],
      },
    ],
  };

  const totalStoredAndAvoidedCO2Impact =
    avoidedCO2TonsWithEnergyProduction.forecast +
    (soilsCarbonStorage.forecast.total - soilsCarbonStorage.current.total);

  return (
    <ImpactCard title="☁️ CO2-eq stocké ou évité">
      <div style={{ textAlign: "center" }}>{formatCO2Impact(totalStoredAndAvoidedCO2Impact)}</div>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </ImpactCard>
  );
}

export default StoredAndAvoidedCO2ImpactCard;
