import type { LetterGrade } from "shared";

import type { DevelopmentScoreDataView } from "../../application/project-impacts/selectors/projectDevelopmentScore.selectors";
import ImpactChartCard from "../shared/charts/ImpactChartCard";
import useImpactAreaChartProps from "../shared/charts/useImpactAreaChartProps";
import ProjectDevelopmentGrade from "./ProjectDevelopmentGrade";
import GradeTextBadge from "./ProjectDevelopmentScoreGradeTextBadge";

type Props = DevelopmentScoreDataView["details"]["fullTimeJobsScore"];

const getLetterGradeBadgeText = (letterGrade: LetterGrade) => {
  switch (letterGrade) {
    case "A":
      return "En forte hausse";
    case "B":
      return "En hausse significative";
    case "C":
      return "En légère hausse ou égal";
    case "D":
      return "En baisse";
    case "E":
      return "En forte baisse";
  }
};
export default function ProjectDevelopmentFullTimeJobsScore({ score, details }: Props) {
  const { fullTimeJobs } = details;
  const { siteStatuQuoFullTimeJobs, difference } = fullTimeJobs?.metrics ?? {
    difference: 0,
    siteStatuQuoFullTimeJobs: 0,
  };

  const { options, colors, chartContainerId } = useImpactAreaChartProps({
    title: "🧑‍🔧️ Nombre d’emplois équivalent temps plein",
    type: "etp",
    color: "#CAD3DB",
    base: siteStatuQuoFullTimeJobs,
    forecast: siteStatuQuoFullTimeJobs + difference,
    difference: difference,
  });

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div>
        <h4>Emploi</h4>
        <ProjectDevelopmentGrade score={score} />
      </div>

      <div className="md:col-span-2">
        <ImpactChartCard
          headerSlot={{
            element: (
              <GradeTextBadge
                letterGrade={score.letterGrade}
                badgeText={getLetterGradeBadgeText(score.letterGrade)}
              />
            ),
            preventClick: false,
          }}
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
