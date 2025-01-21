import { fr } from "@codegouvfr/react-dsfr";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useRef } from "react";
import { SoilsDistribution, typedObjectEntries } from "shared";

import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/core/format-number/formatNumber";
import { getLabelForSoilType } from "@/shared/core/label-mapping/soilTypeLabelMapping";
import { getColorForSoilType } from "@/shared/core/soils";

import { withDefaultChartOptions } from "../../charts";
import HighchartsCustomColorsWrapper from "./HighchartsCustomColorsWrapper";

type Props = {
  soilsDistribution: SoilsDistribution;
  remainderSurfaceArea?: number;
  customHeight?: number | string;
  noLabels?: boolean;
};

const SurfaceAreaPieChart = ({
  soilsDistribution,
  remainderSurfaceArea,
  customHeight = "300px",
  noLabels = false,
}: Props) => {
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

  const variablePieChartOptions: Highcharts.Options = withDefaultChartOptions({
    chart: {
      styledMode: true,
      height: customHeight,
    },
    tooltip: {
      pointFormat: `Superficie : <strong>{point.y} ${SQUARE_METERS_HTML_SYMBOL}</strong> ({point.percentage:.2f}%)`,
    },
    plotOptions: { pie: { cursor: "pointer", dataLabels: { enabled: !noLabels } } },
    series: [
      {
        name: "Superficie",
        type: "pie",
        data,
      },
    ],
  });

  return (
    <HighchartsCustomColorsWrapper colors={data.map(({ color }) => color)}>
      <HighchartsReact
        highcharts={Highcharts}
        options={variablePieChartOptions}
        ref={variablePieChartRef}
      />
    </HighchartsCustomColorsWrapper>
  );
};

export default SurfaceAreaPieChart;
