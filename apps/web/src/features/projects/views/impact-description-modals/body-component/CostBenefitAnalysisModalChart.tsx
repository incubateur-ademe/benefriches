import * as Highcharts from "highcharts";
import { HighchartsReact } from "highcharts-react-official";
import { useId } from "react";

import type { ModalDataProps } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";
// oxlint-disable-next-line import/no-unassigned-import
import "@/features/projects/views/project-break-even-level/charts/BreakEvenLevelChart.css";
import { useGetBreakEventLevelColumnChartProps } from "@/features/projects/views/project-break-even-level/charts/chart-options/breakEvenLevelChartOptions";
import { useChartCustomSerieColors } from "@/shared/views/charts/useChartCustomColors";

type Props = {
  impactsData: ModalDataProps["impactsData"];
  ref?: React.RefObject<HighchartsReact.RefObject | null>;
};

const CostBenefitAnalysisModalChart = ({ impactsData, ref }: Props) => {
  const { options, containerProps } = useGetBreakEventLevelColumnChartProps({
    projectionYears: impactsData.projectionYears,
    ...impactsData.aggregatedReconversionImpacts,
  });

  const id = useId();

  useChartCustomSerieColors(id, ["#E0A227", "#22AFE5"]);

  return (
    <HighchartsReact
      ref={ref}
      containerProps={{ ...containerProps, id }}
      highcharts={Highcharts}
      options={options}
    />
  );
};

export default CostBenefitAnalysisModalChart;
