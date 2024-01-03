import PhotovoltaicSurfaceForm from "./SurfaceForm";
import PhotovoltaicSurfaceFromPowerForm from "./SurfaceFromPowerForm";

import {
  goToStep,
  ProjectCreationStep,
  setPhotovoltaicInstallationSurface,
} from "@/features/create-project/application/createProject.reducer";
import { PHOTOVOLTAIC_RATIO_M2_PER_KWC } from "@/features/create-project/domain/photovoltaic";
import { PhotovoltaicKeyParameter } from "@/features/create-project/domain/project.types";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const computePhotovoltaicSurfaceFromElectricalPower = (power = 0) => {
  return Math.round(power * PHOTOVOLTAIC_RATIO_M2_PER_KWC);
};

function PhotovoltaicSurfaceContainer() {
  const dispatch = useAppDispatch();
  const surfaceArea = useAppSelector((state) => state.projectCreation.siteData?.surfaceArea);
  const electricalPowerKWc = useAppSelector(
    (state) => state.projectCreation.projectData.photovoltaicInstallationElectricalPowerKWc,
  );

  const photovoltaicKeyParameter = useAppSelector(
    (state) => state.projectCreation.projectData.photovoltaicKeyParameter,
  );

  if (photovoltaicKeyParameter === PhotovoltaicKeyParameter.POWER) {
    return (
      <PhotovoltaicSurfaceFromPowerForm
        recommendedSurface={computePhotovoltaicSurfaceFromElectricalPower(electricalPowerKWc)}
        siteSurfaceArea={surfaceArea ?? 0}
        electricalPowerKWc={electricalPowerKWc ?? 0}
        onSubmit={(data) => {
          dispatch(
            setPhotovoltaicInstallationSurface(data.photovoltaicInstallationSurfaceSquareMeters),
          );
          dispatch(goToStep(ProjectCreationStep.PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION));
        }}
      />
    );
  }

  return (
    <PhotovoltaicSurfaceForm
      siteSurfaceArea={surfaceArea ?? 0}
      onSubmit={(data) => {
        dispatch(
          setPhotovoltaicInstallationSurface(data.photovoltaicInstallationSurfaceSquareMeters),
        );
        dispatch(goToStep(ProjectCreationStep.PHOTOVOLTAIC_POWER));
      }}
    />
  );
}

export default PhotovoltaicSurfaceContainer;
