import { useMemo } from "react";
import EconomicEvaluationComparisonChart from "./EconomicEvaluationComparisonChart";

import { ProjectImpactsComparisonState } from "@/features/projects/application/projectImpactsComparison.reducer";
import {
  getEconomicResultsOfProjectForDuration,
  getEconomicResultsOfSiteForDuration,
} from "@/features/projects/domain/computations/economicResults";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

type SuccessDataState = {
  siteData: Exclude<ProjectImpactsComparisonState["siteData"], undefined>;
  projectData: Exclude<ProjectImpactsComparisonState["projectData"], undefined>;
  otherProjectData: Exclude<ProjectImpactsComparisonState["otherProjectData"], undefined>;
  withProject: string;
};

type Props = {
  duration: number;
};

function EconomicEvaluationComparisonContainer({ duration }: Props) {
  const { siteData, projectData, withProject, otherProjectData } = useAppSelector(
    (state) => state.projectImpactsComparison,
  ) as SuccessDataState;

  const { baseImpactValue, withImpactValue, baseOwnerName, withOwnerName } = useMemo(() => {
    if (withProject === "STATU_QUO") {
      return {
        baseImpactValue: getEconomicResultsOfSiteForDuration(siteData, duration),

        withImpactValue: getEconomicResultsOfProjectForDuration(projectData, duration),
        baseOwnerName: siteData.owner.name,
        withOwnerName: projectData.futureOperator.name,
      };
    }
    return {
      baseImpactValue: getEconomicResultsOfProjectForDuration(projectData, duration),
      withImpactValue: getEconomicResultsOfProjectForDuration(otherProjectData, duration),
      withOwnerName: otherProjectData.futureOperator.name,
      baseOwnerName: projectData.futureOperator.name,
    };
  }, [duration, otherProjectData, projectData, siteData, withProject]);

  return (
    <EconomicEvaluationComparisonChart
      baseOwnerName={baseOwnerName}
      withOwnerName={withOwnerName}
      withImpactValue={withImpactValue}
      baseImpactValue={baseImpactValue}
    />
  );
}

export default EconomicEvaluationComparisonContainer;
