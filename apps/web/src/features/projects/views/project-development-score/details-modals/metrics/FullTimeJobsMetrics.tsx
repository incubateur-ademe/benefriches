import { formatSurfaceArea } from "shared";

import type { DevelopmentScoreDataView } from "@/features/projects/application/project-impacts/selectors/projectDevelopmentScore.selectors";

import { formatETPImpact } from "../../../shared/formatImpactValue";

export default function FullTimeJobsMetrics({
  developmentScore,
}: Pick<DevelopmentScoreDataView, "developmentScore">) {
  const { metrics } = developmentScore.details.fullTimeJobsScore.indicators.fullTimeJobs;

  return (
    <ul>
      <li>Surface du site : {formatSurfaceArea(metrics.siteSurfaceArea)}</li>
      <li>
        Nombres d'emplois sur le site après reconversion :{" "}
        {formatETPImpact(metrics.difference, { withSignPrefix: true })}
      </li>
      <li className="font-bold">
        Nombres d'emplois par hectare sur le site après reconversion :{" "}
        {formatETPImpact(metrics.fullTimeJobsDifferenceByHectare, { withSignPrefix: true })}
      </li>
    </ul>
  );
}
