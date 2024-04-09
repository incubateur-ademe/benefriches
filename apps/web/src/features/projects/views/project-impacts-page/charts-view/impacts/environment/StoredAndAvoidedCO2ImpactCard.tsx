import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import ImpactAbsoluteVariation from "../../ImpactChartCard/ImpactAbsoluteVariation";
import ImpactCard from "../../ImpactChartCard/ImpactChartCard";
import ImpactPercentageVariation from "../../ImpactChartCard/ImpactPercentageVariation";

import { formatCO2Impact } from "@/features/projects/views/shared/formatImpactValue";
import { baseAreaChartConfig } from "@/features/projects/views/shared/sharedChartConfig.ts";
import { getPercentageDifference } from "@/shared/services/percentage/percentage";
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

  const currentTotalStoredAndAvoidedCO2Impact =
    avoidedCO2TonsWithEnergyProduction.current + soilsCarbonStorage.current.total;
  const forecastTotalStoredAndAvoidedCO2Impact =
    avoidedCO2TonsWithEnergyProduction.forecast + soilsCarbonStorage.forecast.total;
  const storedAndAvoidedCO2ImpactVariation =
    forecastTotalStoredAndAvoidedCO2Impact - currentTotalStoredAndAvoidedCO2Impact;
  const percentageVariation = getPercentageDifference(
    currentTotalStoredAndAvoidedCO2Impact,
    forecastTotalStoredAndAvoidedCO2Impact,
  );

  return (
    <ImpactCard title="☁️ CO2-eq stocké ou évité">
      <ImpactPercentageVariation percentage={percentageVariation} />
      <ImpactAbsoluteVariation>
        {formatCO2Impact(storedAndAvoidedCO2ImpactVariation)}
      </ImpactAbsoluteVariation>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </ImpactCard>
  );
}

export default StoredAndAvoidedCO2ImpactCard;
