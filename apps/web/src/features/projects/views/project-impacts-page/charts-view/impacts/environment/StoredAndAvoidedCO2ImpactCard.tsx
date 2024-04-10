import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import ImpactAbsoluteVariation from "../../ImpactChartCard/ImpactAbsoluteVariation";
import ImpactCard from "../../ImpactChartCard/ImpactChartCard";
import ImpactPercentageVariation from "../../ImpactChartCard/ImpactPercentageVariation";

import { convertCarbonToCO2eq } from "@/features/projects/views/shared/convertCarbonToCO2eq";
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
  const currentSoilsStorageCO2eq = convertCarbonToCO2eq(soilsCarbonStorage.current.total);
  const forecastSoilsStorageCO2eq = convertCarbonToCO2eq(soilsCarbonStorage.forecast.total);

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
        name: "CO2-eq stocké par les sols",
        type: "area",
        data: [roundTo2Digits(currentSoilsStorageCO2eq), roundTo2Digits(forecastSoilsStorageCO2eq)],
      },
    ],
  };

  const currentTotalStoredAndAvoidedCO2Impact =
    avoidedCO2TonsWithEnergyProduction.current + currentSoilsStorageCO2eq;

  const forecastTotalStoredAndAvoidedCO2Impact =
    avoidedCO2TonsWithEnergyProduction.forecast + forecastSoilsStorageCO2eq;

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
