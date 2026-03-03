import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  navigateToNext,
  navigateToPrevious,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectPVSoilsSummaryViewData } from "@/features/create-project/core/renewable-energy/step-handlers/soils-transformation/soils-transformation-soils-summary/soilsTransformationSoilsSummary.selector";

import ProjectSoilsSummary from "./ProjectSoilsSummary";

function ProjectSoilsSummaryContainer() {
  const dispatch = useAppDispatch();
  const onNext = () => {
    dispatch(navigateToNext());
  };
  const onBack = () => {
    dispatch(navigateToPrevious());
  };
  const { siteSoilsDistribution, projectSoilsDistribution } = useAppSelector(
    selectPVSoilsSummaryViewData,
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
