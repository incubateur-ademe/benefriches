import ProjectSoilsSummary from "./ProjectSoilsSummary";

import {
  completeSoilsSummaryStep,
  revertSoilsSummaryStep,
} from "@/features/create-project/application/createProject.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

function ProjectSoilsSummaryContainer() {
  const dispatch = useAppDispatch();
  const onNext = () => {
    dispatch(completeSoilsSummaryStep());
  };
  const onBack = () => {
    dispatch(revertSoilsSummaryStep());
  };
  const siteSoilsDistribution = useAppSelector(
    (state) => state.projectCreation.siteData?.soilsDistribution ?? {},
  );
  const totalSurfaceArea = useAppSelector(
    (state) => state.projectCreation.siteData?.surfaceArea ?? 0,
  );
  const projectSoilsDistribution = useAppSelector(
    (state) => state.projectCreation.projectData.soilsDistribution ?? {},
  );

  return (
    <ProjectSoilsSummary
      totalSurfaceArea={totalSurfaceArea}
      siteSoilsDistribution={siteSoilsDistribution}
      projectSoilsDistribution={projectSoilsDistribution}
      onNext={onNext}
      onBack={onBack}
    />
  );
}

export default ProjectSoilsSummaryContainer;
