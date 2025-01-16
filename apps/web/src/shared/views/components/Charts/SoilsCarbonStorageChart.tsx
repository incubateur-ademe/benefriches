import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "highcharts/modules/variable-pie";
import { useRef } from "react";
import { SoilType } from "shared";

import { getLabelForSoilType } from "@/shared/core/label-mapping/soilTypeLabelMapping";
import { getColorForCarbonStorageSoilType } from "@/shared/core/soils";

import HighchartsCustomColorsWrapper from "./HighchartsCustomColorsWrapper";

type Props = {
  soilsCarbonStorage: {
    type: SoilType;
    surfaceArea: number;
    carbonStorage: number;
    carbonStorageInTonPerSquareMeters: number;
  }[];
  customHeight?: number | string;
  noLabels?: boolean;
};

const SoilsCarbonStorageChart = ({
  soilsCarbonStorage,
  customHeight = "300px",
  noLabels,
}: Props) => {
  const variablePieChartRef = useRef<HighchartsReact.RefObject>(null);

  const soilsData = soilsCarbonStorage.filter(({ surfaceArea }) => surfaceArea > 0);

  const variablePieChartOptions: Highcharts.Options = {
    title: { text: "" },
    chart: {
      styledMode: true,
      height: customHeight,
    },
    credits: { enabled: false },
    tooltip: {
      distance: 40,
      pointFormat:
        "Stocke <strong>{point.carbonStorage:,.0f} t de carbone </strong><br>" +
        "Superficie : {point.y:,.0f} m²<br>" +
        "Carbone stockable / m² : {point.z:.3f} t",
    },
    plotOptions: {
      variablepie: { cursor: "pointer", dataLabels: { enabled: !noLabels } },
    },
    series: [
      {
        name: "",
        type: "variablepie",
        zMin: 0,
        data: soilsData.map((soilData) => ({
          name: getLabelForSoilType(soilData.type),
          z: soilData.carbonStorageInTonPerSquareMeters,
          y: soilData.surfaceArea,
          carbonStorage: soilData.carbonStorage,
        })),
      },
    ],
  };

  return (
    <HighchartsCustomColorsWrapper
      colors={soilsData.map((soilData) => getColorForCarbonStorageSoilType(soilData.type))}
    >
      <HighchartsReact
        highcharts={Highcharts}
        options={variablePieChartOptions}
        ref={variablePieChartRef}
      />
    </HighchartsCustomColorsWrapper>
  );
};

export default SoilsCarbonStorageChart;
