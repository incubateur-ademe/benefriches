import { completeSoilsSummaryStep } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { soilsSummaryStepReverted } from "@/features/create-project/core/renewable-energy/actions/revert.actions";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import ProjectSoilsSummary from "./ProjectSoilsSummary";

function ProjectSoilsSummaryContainer() {
  const dispatch = useAppDispatch();
  const onNext = () => {
    dispatch(completeSoilsSummaryStep());
  };
  const onBack = () => {
    dispatch(soilsSummaryStepReverted());
  };
  const siteSoilsDistribution = useAppSelector(
    (state) => state.projectCreation.siteData?.soilsDistribution ?? {},
  );
  const projectSoilsDistribution = useAppSelector(
    (state) => state.projectCreation.renewableEnergyProject.creationData.soilsDistribution ?? {},
  );

  return (
    <ProjectSoilsSummary
      siteSoilsDistribution={siteSoilsDistribution}
      projectSoilsDistribution={projectSoilsDistribution}
      onNext={onNext}
      onBack={onBack}
    />
  );
}

export default ProjectSoilsSummaryContainer;
