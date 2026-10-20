import type { Link } from "type-route";

import type { DevelopmentScoreDataView } from "../../application/project-impacts/selectors/projectDevelopmentScore.selectors";
import ImpactChartCard from "../shared/charts/ImpactChartCard";
import useImpactAreaChartProps from "../shared/charts/useImpactAreaChartProps";
import ProjectDevelopmentScoreFamilyHeader from "./layout/ProjectDevelopmentScoreFamilyHeader";
import GradeTextBadge from "./layout/ProjectDevelopmentScoreGradeTextBadge";
import { getLetterGradeBadgeText } from "./layout/gradeLabels";

type Props = DevelopmentScoreDataView["developmentScore"]["details"]["fullTimeJobsScore"] & {
  linkProps: Link;
  anchor: string;
};

export default function ProjectDevelopmentFullTimeJobsScore({
  score,
  indicators,
  linkProps,
  anchor,
}: Props) {
  const { fullTimeJobs } = indicators;
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
      <ProjectDevelopmentScoreFamilyHeader
        anchor={anchor}
        title="Emploi"
        score={score}
        linkProps={linkProps}
      />

      <div className="md:col-span-2">
        <ImpactChartCard
          linkProps={linkProps}
          headerSlot={{
            element: (
              <GradeTextBadge
                letterGrade={score.letterGrade}
                badgeText={getLetterGradeBadgeText("evolution", score.letterGrade)}
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
