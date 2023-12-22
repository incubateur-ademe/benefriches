import { useMemo } from "react";
import EconomicResultsCard from "./EconomicResultsCard";

import { getEconomicResultsOfProjectForDuration } from "@/features/projects/domain/computations/economicResults";
import { Project } from "@/features/projects/domain/projects.types";

type Props = {
  projectData: Project;
  duration: number;
};

function EconomicResultsContainer({ projectData, duration }: Props) {
  const impactValue = useMemo(
    () => getEconomicResultsOfProjectForDuration(projectData, duration),
    [duration, projectData],
  );

  const { futureOperator } = projectData;

  return <EconomicResultsCard impactValue={impactValue} ownerName={futureOperator.name} />;
}

export default EconomicResultsContainer;
