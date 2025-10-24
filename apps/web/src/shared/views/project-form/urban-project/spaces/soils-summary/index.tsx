import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import UrbanProjectSoilsSummary from "./UrbanProjectSoilsSummary";

function UrbanProjectSoilsSummaryContainer() {
  const { onBack, onNext, selectSiteSoilsDistribution, selectProjectSoilsDistribution } =
    useProjectForm();

  const siteSoilsDistribution = useAppSelector(selectSiteSoilsDistribution);
  const projectSoilsDistribution = useAppSelector(selectProjectSoilsDistribution);

  return (
    <UrbanProjectSoilsSummary
      onNext={onNext}
      onBack={onBack}
      siteSoilsDistribution={siteSoilsDistribution}
      projectSoilsDistribution={projectSoilsDistribution}
    />
  );
}

export default UrbanProjectSoilsSummaryContainer;
