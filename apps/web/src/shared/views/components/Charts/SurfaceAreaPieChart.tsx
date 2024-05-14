import { useRef } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { SoilsDistribution, typedObjectEntries } from "shared";

import { getHighchartStyleForSoilTypes } from "@/shared/domain/soils";
import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/services/format-number/formatNumber";
import { getLabelForSoilType } from "@/shared/services/label-mapping/soilTypeLabelMapping";

type Props = {
  soilsDistribution: SoilsDistribution;
};

const SurfaceAreaPieChart = ({ soilsDistribution }: Props) => {
  const variablePieChartRef = useRef<HighchartsReact.RefObject>(null);
  const soilsEntries = typedObjectEntries(soilsDistribution).filter(
    ([, surfaceArea]) => (surfaceArea as number) > 0,
  );

  const data = soilsEntries.map(([soilType, surfaceArea]) => {
    return {
      name: getLabelForSoilType(soilType),
      y: surfaceArea,
    };
  });

  const variablePieChartOptions: Highcharts.Options = {
    title: { text: "" },
    chart: {
      styledMode: true,
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
    <div
      className={fr.cx("fr-container", "fr-py-4w")}
      style={getHighchartStyleForSoilTypes(soilsEntries.map(([soilType]) => soilType))}
    >
      <HighchartsReact
        highcharts={Highcharts}
        options={variablePieChartOptions}
        ref={variablePieChartRef}
      />
    </div>
  );
};

export default SurfaceAreaPieChart;
