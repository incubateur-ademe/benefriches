import ProjectSoilsSummary from "./ProjectSoilsSummary";

import {
  goToStep,
  ProjectCreationStep,
} from "@/features/create-project/application/createProject.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

function ProjectSoilsSummaryContainer() {
  const dispatch = useAppDispatch();
  const onNext = () => dispatch(goToStep(ProjectCreationStep.SOILS_CARBON_STORAGE));
  const siteSoilsSurfaceAreas = useAppSelector(
    (state) => state.projectCreation.siteData?.soilsSurfaceAreas ?? {},
  );
  const totalSurfaceArea = useAppSelector(
    (state) => state.projectCreation.siteData?.surfaceArea ?? 0,
  );
  const projectSoilsSurfaceAreas = useAppSelector(
    (state) => state.projectCreation.projectData.soilsSurfaceAreas ?? {},
  );

  return (
    <ProjectSoilsSummary
      totalSurfaceArea={totalSurfaceArea}
      siteSoilsSurfaceAreas={siteSoilsSurfaceAreas}
      projectSoilsSurfaceAreas={projectSoilsSurfaceAreas}
      onNext={onNext}
    />
  );
}

export default ProjectSoilsSummaryContainer;
