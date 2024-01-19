import { useRef } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { SQUARE_METERS_HTML_SYMBOL } from "../SurfaceArea/SurfaceArea";

import { getColorForSoilType, SoilType } from "@/shared/domain/soils";
import { getLabelForSoilType } from "@/shared/services/label-mapping/soilTypeLabelMapping";

type Props = {
  soilsDistribution: Partial<Record<SoilType, number>>;
};

const SurfaceAreaPieChart = ({ soilsDistribution }: Props) => {
  const variablePieChartRef = useRef<HighchartsReact.RefObject>(null);
  const data = Object.entries(soilsDistribution).map(([soilType, surfaceArea]) => {
    return {
      name: getLabelForSoilType(soilType as SoilType),
      y: surfaceArea,
      color: getColorForSoilType(soilType as SoilType),
    };
  });

  const variablePieChartOptions: Highcharts.Options = {
    title: { text: "" },
    chart: {
      backgroundColor: "transparent",
      style: {
        fontFamily: "Marianne",
      },
    },
    tooltip: {
      pointFormat: `Superficie : <strong>{point.y} ${SQUARE_METERS_HTML_SYMBOL}</strong> ({point.percentage:.2f}%)`,
    },
    plotOptions: { pie: { cursor: "pointer" } },
    series: [
      {
        name: "Stockage carbone",
        type: "pie",
        data,
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

export default SurfaceAreaPieChart;
