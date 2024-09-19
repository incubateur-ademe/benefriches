import { useRef } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { SoilsDistribution, typedObjectEntries } from "shared";
import classNames from "../../clsx";
import HighchartsCustomColorsWrapper from "./HighchartsCustomColorsWrapper";

import { getColorForSoilType } from "@/shared/domain/soils";
import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/services/format-number/formatNumber";
import { getLabelForSoilType } from "@/shared/services/label-mapping/soilTypeLabelMapping";

type Props = {
  soilsDistribution: SoilsDistribution;
  remainderSurfaceArea?: number;
};

const SurfaceAreaPieChart = ({ soilsDistribution, remainderSurfaceArea }: Props) => {
  const variablePieChartRef = useRef<HighchartsReact.RefObject>(null);
  const soilsEntries = typedObjectEntries(soilsDistribution).filter(
    ([, surfaceArea]) => (surfaceArea as number) > 0,
  );

  const data = soilsEntries.map(([soilType, surfaceArea]) => {
    return {
      name: getLabelForSoilType(soilType),
      y: surfaceArea,
      color: getColorForSoilType(soilType),
    };
  });

  if (remainderSurfaceArea) {
    data.push({
      name: "Non assigné",
      y: remainderSurfaceArea,
      color: fr.colors.decisions.border.disabled.grey.default,
    });
  }

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
        name: "Superficie",
        type: "pie",
        data,
      },
    ],
  };

  return (
    <div className={classNames(fr.cx("fr-container", "fr-py-4w"))}>
      <HighchartsCustomColorsWrapper colors={data.map(({ color }) => color)}>
        <HighchartsReact
          highcharts={Highcharts}
          options={variablePieChartOptions}
          ref={variablePieChartRef}
        />
      </HighchartsCustomColorsWrapper>
    </div>
  );
};

export default SurfaceAreaPieChart;
