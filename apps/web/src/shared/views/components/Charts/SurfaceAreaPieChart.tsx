import { useRef } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { SoilsDistribution, typedObjectEntries } from "shared";
import { SQUARE_METERS_HTML_SYMBOL } from "../SurfaceArea/SurfaceArea";

import { getColorForSoilType } from "@/shared/domain/soils";
import { getLabelForSoilType } from "@/shared/services/label-mapping/soilTypeLabelMapping";

type Props = {
  soilsDistribution: SoilsDistribution;
};

const SurfaceAreaPieChart = ({ soilsDistribution }: Props) => {
  const variablePieChartRef = useRef<HighchartsReact.RefObject>(null);
  const data = typedObjectEntries(soilsDistribution)
    .filter(([, surfaceArea]) => (surfaceArea as number) > 0)
    .map(([soilType, surfaceArea]) => {
      return {
        name: getLabelForSoilType(soilType),
        y: surfaceArea,
        color: getColorForSoilType(soilType),
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
    credits: { enabled: false },
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
