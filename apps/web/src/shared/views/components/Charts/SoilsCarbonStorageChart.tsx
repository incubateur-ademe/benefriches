import { useRef } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import * as Highcharts from "highcharts";
import highchartsVariablePie from "highcharts/modules/variable-pie";
import HighchartsReact from "highcharts-react-official";

import { getColorForSoilType, SoilType } from "@/shared/domain/soils";
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

  const variablePieChartOptions: Highcharts.Options = {
    title: { text: "" },
    chart: {
      backgroundColor: "transparent",
      style: {
        fontFamily: "Marianne",
      },
    },
    credits: { enabled: false },
    tooltip: {
      distance: 40,
      pointFormat:
        "Stocke <strong>{point.options.custom.carbonStorage:,.0f} t de carbone </strong><br>" +
        "Superficie : {point.y:,.0f} m²<br>" +
        "Carbone stockable / m² : {point.z:.3f} t",
    },
    plotOptions: {
      series: {
        keys: ["name", "z", "y", "custom.carbonStorage", "color"],
      },
      variablepie: { cursor: "pointer" },
    },
    series: [
      {
        name: "",
        type: "variablepie",
        zMin: 0,
        data: soilsCarbonStorage
          .filter(({ surfaceArea }) => surfaceArea > 0)
          .map((soilData) => [
            getLabelForSoilType(soilData.type),
            soilData.carbonStorageInTonPerSquareMeters,
            soilData.surfaceArea,
            soilData.carbonStorage,
            getColorForSoilType(soilData.type),
          ]),
      },
    ],
  };

  return (
    <div className={fr.cx("fr-container", "fr-py-4w")}>
      <HighchartsReact
        highcharts={Highcharts}
        options={variablePieChartOptions}
        ref={variablePieChartRef}
      />
    </div>
  );
};

export default SoilsCarbonStorageChart;
