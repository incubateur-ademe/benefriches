import { DevelopmentScoreDataView } from "../../application/project-impacts/projectDevelopmentScore.selectors";
import ImpactChartCard from "../project-page/impacts/charts-view/ImpactChartCard/ImpactChartCard";
import useImpactAreaChartProps from "../shared/charts/useImpactAreaChartProps";
import IconFail from "./ProjectDevelopmentIconFail";
import IconSuccess from "./ProjectDevelopmentIconSuccess";

type Props = Pick<DevelopmentScoreDataView, "fullTimeJobsScore">;

export default function ProjectDevelopmentFullTimeJobsScore({ fullTimeJobsScore }: Props) {
  const { options, colors, chartContainerId } = useImpactAreaChartProps({
    title: "🧑‍🔧️ Nombre d’emplois équivalent temps plein",
    type: "etp",
    color: "#CAD3DB",
    base: fullTimeJobsScore.metrics?.base ?? 0,
    forecast: fullTimeJobsScore.metrics?.forecast ?? 0,
    difference: fullTimeJobsScore.metrics?.difference ?? 0,
  });

  return (
    <div className="grid md:grid-cols-12 gap-12">
      <div className="md:col-span-4">
        <h4>Emploi</h4>
        {fullTimeJobsScore.isSuccess ? <IconSuccess /> : <IconFail />}
      </div>

      <div className="md:col-start-5 md:col-span-8">
        <ImpactChartCard
          title="🧑‍🔧️ Nombre d’emplois équivalent temps plein"
          exportingOptions={{ colors, colorBySeries: true }}
          containerProps={{
            id: chartContainerId,
          }}
          options={options}
          classes={{ title: "text-xl" }}
        />
      </div>
    </div>
  );
}
