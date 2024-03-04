import PhotovoltaicSurfaceForm from "./SurfaceForm";
import PhotovoltaicSurfaceFromPowerForm from "./SurfaceFromPowerForm";

import { completePhotovoltaicInstallationSurface } from "@/features/create-project/application/createProject.reducer";
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

  const onSubmit = (data: { photovoltaicInstallationSurfaceSquareMeters: number }) => {
    dispatch(
      completePhotovoltaicInstallationSurface(data.photovoltaicInstallationSurfaceSquareMeters),
    );
  };

  if (photovoltaicKeyParameter === PhotovoltaicKeyParameter.POWER) {
    return (
      <PhotovoltaicSurfaceFromPowerForm
        recommendedSurface={computePhotovoltaicSurfaceFromElectricalPower(electricalPowerKWc)}
        siteSurfaceArea={surfaceArea ?? 0}
        electricalPowerKWc={electricalPowerKWc ?? 0}
        onSubmit={onSubmit}
      />
    );
  }

  return <PhotovoltaicSurfaceForm siteSurfaceArea={surfaceArea ?? 0} onSubmit={onSubmit} />;
}

export default PhotovoltaicSurfaceContainer;
