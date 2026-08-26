import { SegmentedControl, SegmentedControlProps } from "@codegouvfr/react-dsfr/SegmentedControl";
import { useState } from "react";
import { Link } from "type-route";

import useExportConfig from "@/shared/views/charts/useExportConfig";

import ImpactChartCard from "../../shared/charts/ImpactChartCard";
// oxlint-disable-next-line import/no-unassigned-import
import "./BreakEvenLevelChart.css";
import {
  useGetBreakEventLevelColumnChartProps,
  useGetBreakEventLevelAreaChartProps,
} from "./chart-options/breakEvenLevelChartOptions";

type Props = {
  cumulativeEconomicBalanceByYear: number[];
  cumulativeIndirectEconomicImpactsByYear: number[];
  cumulativeBalanceByYear: number[];
  projectionYears: string[];
  breakEvenIndex?: number;
  breakEvenYear?: string;
  linkProps?: Link;
};

const BreakEvenLevelChart = (props: Props) => {
  const [chartType, setChartType] = useState<"column" | "area">(
    props.breakEvenIndex ? "area" : "column",
  );
  const exportConfig = useExportConfig({
    title: "📈 Évolution de la balance coût-bénéfice",
  });

  const columnChartProps = useGetBreakEventLevelColumnChartProps(props);
  const areaChartProps = useGetBreakEventLevelAreaChartProps(props);

  const segments: SegmentedControlProps["segments"] = [
    {
      label: "Courbes",
      iconId: "fr-icon-line-chart-line",
      nativeInputProps: {
        checked: chartType === "area",
        onChange: () => {
          setChartType("area");
        },
      },
    },
    {
      label: "Barres",
      iconId: "fr-icon-bar-chart-box-line",
      nativeInputProps: {
        checked: chartType === "column",
        onChange: () => {
          setChartType("column");
        },
      },
    },
  ];

  const { options, containerProps } = chartType === "area" ? areaChartProps : columnChartProps;

  return (
    <ImpactChartCard
      key={chartType} // force React à démonter/remonter pour qu'Highcharts recrée l'instance
      title="📈 Évolution de la balance coût-bénéfice"
      options={options}
      containerProps={containerProps}
      linkProps={props.linkProps}
      exportingOptions={exportConfig}
      actions={<SegmentedControl small legend="type de graphique" hideLegend segments={segments} />}
    />
  );
};

export default BreakEvenLevelChart;
