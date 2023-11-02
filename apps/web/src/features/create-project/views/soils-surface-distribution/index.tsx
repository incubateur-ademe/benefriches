import SoilDistributionForm from "./SoilsSurfaceDistributionForm";

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

function ProjectSoilsSurfaceDistributionContainer() {
  const dispatch = useAppDispatch();

  const relatedSite = useAppSelector(
    (state) => state.projectCreation.projectData.relatedSite,
  );

  const { surfaceArea, soilsSurfaceAreas } = relatedSite;

  const photovoltaic = useAppSelector(
    (state) => state.projectCreation.projectData.photovoltaic,
  );

  const { accessPathsSurface, foundationsSurface, surface } = photovoltaic;

  return (
    <SoilDistributionForm
      totalSurfaceArea={surfaceArea}
      siteSoils={soilsSurfaceAreas}
      minAdvisedFlatSurfaces={surface}
      minAdvisedSoilSurfacesByType={{
        [SoilType.MINERAL_SOIL]: accessPathsSurface,
        [SoilType.IMPERMEABLE_SOILS]: foundationsSurface,
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
        dispatch(goToStep(ProjectCreationStep.CREATION_CONFIRMATION));
      }}
    />
  );
}

export default ProjectSoilsSurfaceDistributionContainer;
