import { selectSiteSoilsDistribution } from "@/features/create-project/core/createProject.selectors";
import { selectProjectSoilDistribution } from "@/features/create-project/core/urban-project-beta/urbanProject.selectors";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import { useInformationalStepBackNext } from "../../useInformationalStepBackNext";
import UrbanProjectSoilsSummary from "./UrbanProjectSoilsSummary";

function UrbanProjectSoilsSummaryContainer() {
  const siteSoilsDistribution = useAppSelector(selectSiteSoilsDistribution);
  const projectSoilsDistribution = useAppSelector(selectProjectSoilDistribution);
  const { onNext, onBack } = useInformationalStepBackNext();

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
