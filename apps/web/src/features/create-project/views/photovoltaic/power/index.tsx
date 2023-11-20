import PhotovoltaicPowerForm from "./PowerForm";
import PhotovoltaicPowerFromSurfaceForm from "./PowerFromSurfaceForm";

import {
  goToStep,
  ProjectCreationStep,
  setPhotovoltaicInstallationElectricalPower,
} from "@/features/create-project/application/createProject.reducer";
import {
  PHOTOVOLTAIC_RATIO_KWC_PER_M2,
  PHOTOVOLTAIC_RATIO_M2_PER_KWC,
} from "@/features/create-project/domain/photovoltaic";
import { PhotovoltaicKeyParameter } from "@/features/create-project/domain/project.types";
import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/views/hooks/store.hooks";

const computePhotovoltaicElectricalPowerFromSurface = (
  surfaceSquareMeters: number,
) => {
  return Math.round(surfaceSquareMeters * PHOTOVOLTAIC_RATIO_KWC_PER_M2);
};

const computeMaxPhotovoltaicElectricalPowerFromSiteSurface = (
  surfaceSquareMeters: number,
) => {
  return Math.round(surfaceSquareMeters / PHOTOVOLTAIC_RATIO_M2_PER_KWC);
};

function PhotovoltaicPowerContainer() {
  const dispatch = useAppDispatch();
  const siteSurfaceArea = useAppSelector(
    (state) => state.projectCreation.siteData?.surfaceArea ?? 0,
  );

  const surfaceSquareMeters = useAppSelector(
    (state) =>
      state.projectCreation.projectData
        .photovoltaicInstallationSurfaceSquareMeters ?? 0,
  );

  const photovoltaicKeyParameter = useAppSelector(
    (state) => state.projectCreation.projectData.photovoltaicKeyParameter,
  );

  if (photovoltaicKeyParameter === PhotovoltaicKeyParameter.SURFACE) {
    return (
      <PhotovoltaicPowerFromSurfaceForm
        recommendedElectricalPowerKWc={computePhotovoltaicElectricalPowerFromSurface(
          surfaceSquareMeters,
        )}
        photovoltaicSurfaceArea={surfaceSquareMeters}
        onSubmit={(data) => {
          dispatch(
            setPhotovoltaicInstallationElectricalPower(
              data.photovoltaicInstallationElectricalPowerKWc,
            ),
          );
          dispatch(
            goToStep(
              ProjectCreationStep.PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION,
            ),
          );
        }}
      />
    );
  }

  return (
    <PhotovoltaicPowerForm
      maxRecommendedElectricalPowerKWc={computeMaxPhotovoltaicElectricalPowerFromSiteSurface(
        siteSurfaceArea,
      )}
      siteSurfaceArea={siteSurfaceArea}
      onSubmit={(data) => {
        dispatch(
          setPhotovoltaicInstallationElectricalPower(
            data.photovoltaicInstallationElectricalPowerKWc,
          ),
        );
        dispatch(goToStep(ProjectCreationStep.PHOTOVOLTAIC_SURFACE));
      }}
    />
  );
}

export default PhotovoltaicPowerContainer;
