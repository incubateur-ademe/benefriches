import SoilDistributionForm from "./SoilsSurfaceAreasForm";

import {
  goToStep,
  ProjectCreationStep,
  setSoilsSurfaceAreas,
} from "@/features/create-project/application/createProject.reducer";
import {
  RECOMMENDED_M2_PER_KWC_FOR_ACCESS_PATHS,
  RECOMMENDED_M2_PER_KWC_FOR_FOUNDATIONS,
} from "@/features/create-project/domain/photovoltaic";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const computeAccessPathsAverageSurfaceFromElectricalPower = (electricalPower: number) =>
  Math.round(electricalPower * RECOMMENDED_M2_PER_KWC_FOR_ACCESS_PATHS);

const computeFoundationsAverageSurfaceFromElectricalPower = (electricalPower: number) =>
  Math.round(electricalPower * RECOMMENDED_M2_PER_KWC_FOR_FOUNDATIONS);

function ProjectSoilsSurfaceAreasContainer() {
  const dispatch = useAppDispatch();

  const siteSurfaceArea = useAppSelector(
    (state) => state.projectCreation.siteData?.surfaceArea ?? 0,
  );
  const siteSoilsSurfaceAreas = useAppSelector(
    (state) => state.projectCreation.siteData?.soilsSurfaceAreas ?? {},
  );

  const photovoltaicSurface = useAppSelector(
    (state) => state.projectCreation.projectData.photovoltaicInstallationSurfaceSquareMeters ?? 0,
  );

  const photovoltaicElectricalPowerKWc = useAppSelector(
    (state) => state.projectCreation.projectData.photovoltaicInstallationElectricalPowerKWc ?? 0,
  );

  return (
    <SoilDistributionForm
      totalSurfaceArea={siteSurfaceArea}
      siteSoils={siteSoilsSurfaceAreas}
      minAdvisedFlatSurfaces={photovoltaicSurface}
      minAdvisedImpermeableSurface={computeFoundationsAverageSurfaceFromElectricalPower(
        photovoltaicElectricalPowerKWc,
      )}
      minAdvisedMineralSurface={computeAccessPathsAverageSurfaceFromElectricalPower(
        photovoltaicElectricalPowerKWc,
      )}
      onSubmit={({ soilsSurfaceAreas }) => {
        dispatch(
          setSoilsSurfaceAreas(
            Object.fromEntries(
              soilsSurfaceAreas.map(({ soilType, surface }) => [soilType, surface]),
            ),
          ),
        );
        dispatch(goToStep(ProjectCreationStep.SOILS_SUMMARY));
      }}
    />
  );
}

export default ProjectSoilsSurfaceAreasContainer;
