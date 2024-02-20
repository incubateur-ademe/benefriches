import { useMemo } from "react";
import EconomicEvaluationComparisonChart from "./EconomicEvaluationComparisonChart";

import {
  getEconomicResultsOfProjectForDuration,
  getEconomicResultsOfSiteForDuration,
} from "@/features/projects/domain/computations/economicResults";
import { Project, ProjectSite } from "@/features/projects/domain/projects.types";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

type SuccessDataState = {
  baseScenarioType: "PROJECT" | "STATU_QUO";
  baseScenarioSiteData: ProjectSite;
  baseScenarioProjectData: Project;
  withScenarioProjectData: Project;
};

type Props = {
  duration: number;
};

function EconomicEvaluationComparisonContainer({ duration }: Props) {
  const {
    baseScenarioType,
    baseScenarioProjectData,
    baseScenarioSiteData,
    withScenarioProjectData,
  } = useAppSelector((state) => ({
    baseScenarioType: state.projectImpactsComparison.baseScenario.type,
    baseScenarioSiteData: state.projectImpactsComparison.baseScenario.siteData,
    baseScenarioProjectData: state.projectImpactsComparison.baseScenario.projectData,
    withScenarioProjectData: state.projectImpactsComparison.withScenario.projectData,
  })) as SuccessDataState;

  const { baseImpactValue, withImpactValue, baseOwnerName, withOwnerName } = useMemo(() => {
    if (baseScenarioType === "STATU_QUO") {
      return {
        baseImpactValue: getEconomicResultsOfSiteForDuration(baseScenarioSiteData, duration),

        withImpactValue: getEconomicResultsOfProjectForDuration(withScenarioProjectData, duration),
        baseOwnerName: baseScenarioSiteData.owner.name,
        withOwnerName: withScenarioProjectData.futureOperator.name,
      };
    }
    return {
      baseImpactValue: getEconomicResultsOfProjectForDuration(baseScenarioProjectData, duration),
      withImpactValue: getEconomicResultsOfProjectForDuration(withScenarioProjectData, duration),
      withOwnerName: withScenarioProjectData.futureOperator.name,
      baseOwnerName: baseScenarioProjectData.futureOperator.name,
    };
  }, [
    baseScenarioProjectData,
    baseScenarioSiteData,
    baseScenarioType,
    duration,
    withScenarioProjectData,
  ]);

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
