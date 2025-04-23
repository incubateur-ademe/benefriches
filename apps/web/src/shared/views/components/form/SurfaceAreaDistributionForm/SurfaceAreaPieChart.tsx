import { fr } from "@codegouvfr/react-dsfr";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useId, useRef } from "react";

import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/core/format-number/formatNumber";
import { withDefaultChartOptions } from "@/shared/views/charts";
import { useChartCustomPointColors } from "@/shared/views/charts/useChartCustomColors";

type Props = {
  soilsDistribution: { name: string; color?: string; value: number }[];
  remainderSurfaceArea?: number;
  customHeight?: number | string;
};

const SurfaceAreaPieChart = ({
  soilsDistribution,
  remainderSurfaceArea,
  customHeight = "300px",
}: Props) => {
  const variablePieChartRef = useRef<HighchartsReact.RefObject>(null);

  const data = soilsDistribution
    .filter(({ value }) => value > 0)
    .map(({ value, name, color }) => {
      return {
        name,
        y: value,
        color: color ?? "inherit",
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
      pointFormat: `Superficie : <strong>{point.y} ${SQUARE_METERS_HTML_SYMBOL}</strong> ({point.percentage:.0f}%)`,
    },
    plotOptions: { pie: { cursor: "pointer", dataLabels: { enabled: false } } },
    series: [
      {
        name: "Superficie",
        type: "pie",
        data,
      },
    ],
  });
  const id = useId();
  useChartCustomPointColors(
    id,
    data.map(({ color }) => color),
  );

  return (
    <HighchartsReact
      highcharts={Highcharts}
      containerProps={{ id }}
      options={variablePieChartOptions}
      ref={variablePieChartRef}
    />
  );
};

export default SurfaceAreaPieChart;
