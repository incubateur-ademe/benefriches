import { useRef } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { SoilType } from "@/features/create-site/domain/siteFoncier.types";
import { getLabelForSoilType } from "@/shared/services/label-mapping/soilTypeLabelMapping";

type Props = {
  soilsSurfaceAreas: Partial<Record<SoilType, number>>;
};

const SurfaceAreaPieChart = ({ soilsSurfaceAreas }: Props) => {
  const variablePieChartRef = useRef<HighchartsReact.RefObject>(null);
  const data = Object.entries(soilsSurfaceAreas).map(
    ([soilType, surfaceArea]) => {
      return {
        name: getLabelForSoilType(soilType as SoilType),
        y: surfaceArea,
      };
    },
  );

  const variablePieChartOptions: Highcharts.Options = {
    title: { text: "" },
    chart: {
      backgroundColor: "transparent",
      style: {
        fontFamily: "Marianne",
      },
    },
    tooltip: {
      pointFormat:
        "Superficie : <strong>{point.y} m2</strong> ({point.percentage:.1f}%)",
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
