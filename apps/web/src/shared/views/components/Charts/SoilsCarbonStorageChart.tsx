import { useRef } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import * as Highcharts from "highcharts";
import highchartsVariablePie from "highcharts/modules/variable-pie";
import HighchartsReact from "highcharts-react-official";

import { getColorForSoilType, SoilType } from "@/shared/domain/soils";
import { getLabelForSoilType } from "@/shared/services/label-mapping/soilTypeLabelMapping";
import { convertSquareMetersToHectares } from "@/shared/services/surface-area/surfaceArea";
highchartsVariablePie(Highcharts);

type Props = {
  soilsCarbonStorage: {
    type: SoilType;
    surfaceArea: number;
    carbonStorage: number;
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
    tooltip: {
      distance: 40,
      pointFormat:
        "Superficie : <strong>{point.y:.2f} ha ({point.percentage:.1f}%)</strong><br>Carbone stockable: <strong>{point.z:.2f} t/ha</strong>",
    },
    credits: {
      enabled: false,
    },
    plotOptions: { variablepie: { cursor: "pointer" } },
    series: [
      {
        name: "",
        type: "variablepie",
        zMin: 0,
        data: soilsCarbonStorage.map((soilData) => ({
          y: convertSquareMetersToHectares(soilData.surfaceArea),
          z: soilData.carbonStorage,
          name: getLabelForSoilType(soilData.type),
          color: getColorForSoilType(soilData.type as SoilType),
        })),
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
