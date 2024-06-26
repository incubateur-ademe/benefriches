import { useRef } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import * as Highcharts from "highcharts";
import highchartsVariablePie from "highcharts/modules/variable-pie";
import HighchartsReact from "highcharts-react-official";
import { SoilType } from "shared";
import HighchartsCustomColorsWrapper from "./HighchartsCustomColorsWrapper";

import { getColorForCarbonStorageSoilType } from "@/shared/domain/soils";
import { getLabelForSoilType } from "@/shared/services/label-mapping/soilTypeLabelMapping";
highchartsVariablePie(Highcharts);

type Props = {
  soilsCarbonStorage: {
    type: SoilType;
    surfaceArea: number;
    carbonStorage: number;
    carbonStorageInTonPerSquareMeters: number;
  }[];
};

const SoilsCarbonStorageChart = ({ soilsCarbonStorage }: Props) => {
  const variablePieChartRef = useRef<HighchartsReact.RefObject>(null);

  const soilsData = soilsCarbonStorage.filter(({ surfaceArea }) => surfaceArea > 0);

  const variablePieChartOptions: Highcharts.Options = {
    title: { text: "" },
    chart: {
      styledMode: true,
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
      variablepie: { cursor: "pointer" },
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
    <div className={fr.cx("fr-container", "fr-py-4w")}>
      <HighchartsCustomColorsWrapper
        colors={soilsData.map((soilData) => getColorForCarbonStorageSoilType(soilData.type))}
      >
        <HighchartsReact
          highcharts={Highcharts}
          options={variablePieChartOptions}
          ref={variablePieChartRef}
        />
      </HighchartsCustomColorsWrapper>
    </div>
  );
};

export default SoilsCarbonStorageChart;
