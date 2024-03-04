import PhotovoltaicPowerForm from "./PowerForm";
import PhotovoltaicPowerFromSurfaceForm from "./PowerFromSurfaceForm";

import { completePhotovoltaicInstallationElectricalPower } from "@/features/create-project/application/createProject.reducer";
import { PHOTOVOLTAIC_RATIO_M2_PER_KWC } from "@/features/create-project/domain/photovoltaic";
import { PhotovoltaicKeyParameter } from "@/features/create-project/domain/project.types";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const computePhotovoltaicElectricalPowerFromSurface = (surfaceSquareMeters: number) => {
  return Math.round(surfaceSquareMeters / PHOTOVOLTAIC_RATIO_M2_PER_KWC);
};

const computeMaxPhotovoltaicElectricalPowerFromSiteSurface = (surfaceSquareMeters: number) => {
  return Math.round(surfaceSquareMeters / PHOTOVOLTAIC_RATIO_M2_PER_KWC);
};

function PhotovoltaicPowerContainer() {
  const dispatch = useAppDispatch();
  const siteSurfaceArea = useAppSelector(
    (state) => state.projectCreation.siteData?.surfaceArea ?? 0,
  );

  const surfaceSquareMeters = useAppSelector(
    (state) => state.projectCreation.projectData.photovoltaicInstallationSurfaceSquareMeters ?? 0,
  );

  const photovoltaicKeyParameter = useAppSelector(
    (state) => state.projectCreation.projectData.photovoltaicKeyParameter,
  );

  const onSubmit = (data: { photovoltaicInstallationElectricalPowerKWc: number }) => {
    dispatch(
      completePhotovoltaicInstallationElectricalPower(
        data.photovoltaicInstallationElectricalPowerKWc,
      ),
    );
  };

  if (photovoltaicKeyParameter === PhotovoltaicKeyParameter.SURFACE) {
    return (
      <PhotovoltaicPowerFromSurfaceForm
        recommendedElectricalPowerKWc={computePhotovoltaicElectricalPowerFromSurface(
          surfaceSquareMeters,
        )}
        photovoltaicSurfaceArea={surfaceSquareMeters}
        onSubmit={onSubmit}
      />
    );
  }

  return (
    <PhotovoltaicPowerForm
      maxRecommendedElectricalPowerKWc={computeMaxPhotovoltaicElectricalPowerFromSiteSurface(
        siteSurfaceArea,
      )}
      siteSurfaceArea={siteSurfaceArea}
      onSubmit={onSubmit}
    />
  );
}

export default PhotovoltaicPowerContainer;
