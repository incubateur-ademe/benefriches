import SoilDistributionForm from "./SoilsDistributionForm";

import { completeSoilsDistribution } from "@/features/create-project/application/createProject.reducer";
import {
  RECOMMENDED_M2_PER_KWC_FOR_ACCESS_PATHS,
  RECOMMENDED_M2_PER_KWC_FOR_FOUNDATIONS,
} from "@/features/create-project/domain/photovoltaic";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const computeAccessPathsAverageSurfaceFromElectricalPower = (electricalPower: number) =>
  Math.round(electricalPower * RECOMMENDED_M2_PER_KWC_FOR_ACCESS_PATHS);

const computeFoundationsAverageSurfaceFromElectricalPower = (electricalPower: number) =>
  Math.round(electricalPower * RECOMMENDED_M2_PER_KWC_FOR_FOUNDATIONS);

function ProjectSoilsDistributionContainer() {
  const dispatch = useAppDispatch();

  const siteSurfaceArea = useAppSelector(
    (state) => state.projectCreation.siteData?.surfaceArea ?? 0,
  );
  const siteSoilsDistribution = useAppSelector(
    (state) => state.projectCreation.siteData?.soilsDistribution ?? {},
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
      siteSoils={siteSoilsDistribution}
      minAdvisedFlatSurfaces={photovoltaicSurface}
      minAdvisedImpermeableSurface={computeFoundationsAverageSurfaceFromElectricalPower(
        photovoltaicElectricalPowerKWc,
      )}
      minAdvisedMineralSurface={computeAccessPathsAverageSurfaceFromElectricalPower(
        photovoltaicElectricalPowerKWc,
      )}
      onSubmit={({ soilsDistribution }) => {
        dispatch(
          completeSoilsDistribution(
            Object.fromEntries(
              soilsDistribution.map(({ soilType, surface }) => [soilType, surface]),
            ),
          ),
        );
      }}
    />
  );
}

export default ProjectSoilsDistributionContainer;
