import SoilDistributionForm from "./SoilsSurfaceAreasForm";

import {
  goToStep,
  ProjectCreationStep,
  setSoilsSurfaceAreas,
} from "@/features/create-project/application/createProject.reducer";
import { SoilType } from "@/features/create-site/domain/siteFoncier.types";
import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/views/hooks/store.hooks";

function ProjectSoilsSurfaceAreasContainer() {
  const dispatch = useAppDispatch();

  const siteSurfaceArea = useAppSelector(
    (state) => state.projectCreation.siteData?.surfaceArea ?? 0,
  );
  const siteSoilsSurfaceAreas = useAppSelector(
    (state) => state.projectCreation.siteData?.soilsSurfaceAreas ?? {},
  );

  const photovoltaicSurface = useAppSelector(
    (state) =>
      state.projectCreation.projectData
        .photovoltaicInstallationSurfaceSquareMeters ?? 0,
  );
  const photovoltaicFoundationsSurface = useAppSelector(
    (state) => state.projectCreation.projectData.photovoltaicFoundationsSurface,
  );
  const photovoltaicAccessPathsSurface = useAppSelector(
    (state) => state.projectCreation.projectData.photovoltaicAccessPathsSurface,
  );

  return (
    <SoilDistributionForm
      totalSurfaceArea={siteSurfaceArea}
      siteSoils={siteSoilsSurfaceAreas}
      minAdvisedFlatSurfaces={photovoltaicSurface}
      minAdvisedSoilSurfacesByType={{
        [SoilType.MINERAL_SOIL]: photovoltaicAccessPathsSurface,
        [SoilType.IMPERMEABLE_SOILS]: photovoltaicFoundationsSurface,
      }}
      onSubmit={({ soilsSurfaceAreas }) => {
        dispatch(
          setSoilsSurfaceAreas(
            Object.fromEntries(
              soilsSurfaceAreas.map(({ soilType, surface }) => [
                soilType,
                surface,
              ]),
            ),
          ),
        );
        dispatch(goToStep(ProjectCreationStep.STAKEHOLDERS_INTRODUCTION));
      }}
    />
  );
}

export default ProjectSoilsSurfaceAreasContainer;
