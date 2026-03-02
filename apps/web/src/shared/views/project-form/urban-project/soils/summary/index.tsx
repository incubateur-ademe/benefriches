import { useAppSelector } from "@/app/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import UrbanProjectSoilsSummary from "./UrbanProjectSoilsSummary";

function UrbanProjectSoilsSummaryContainer() {
  const { onBack, onNext, selectSoilsSummaryViewData } = useProjectForm();
  const { siteSoilsDistribution, projectSoilsDistribution } = useAppSelector(
    selectSoilsSummaryViewData,
  );

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
