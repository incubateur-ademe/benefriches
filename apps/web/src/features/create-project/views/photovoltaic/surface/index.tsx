import PhotovoltaicSurfaceForm from "./SurfaceForm";
import PhotovoltaicSurfaceFromPowerForm from "./SurfaceFromPowerForm";

import {
  completePhotovoltaicInstallationSurface,
  revertPhotovoltaicInstallationSurface,
} from "@/features/create-project/application/createProject.reducer";
import { selectSiteSurfaceArea } from "@/features/create-project/application/createProject.selectors";
import {
  selectPhotovoltaicPlantElectricalPowerKWc,
  selectPhotovoltaicPlantFeaturesKeyParameter,
  selectRecommendedPhotovoltaicPlantSurfaceFromElectricalPower,
} from "@/features/create-project/application/pvFeatures.selectors";
import { PhotovoltaicKeyParameter } from "@/features/create-project/domain/project.types";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

function PhotovoltaicSurfaceContainer() {
  const dispatch = useAppDispatch();
  const surfaceArea = useAppSelector(selectSiteSurfaceArea);
  const electricalPowerKWc = useAppSelector(selectPhotovoltaicPlantElectricalPowerKWc);
  const photovoltaicKeyParameter = useAppSelector(selectPhotovoltaicPlantFeaturesKeyParameter);
  const recommendedSurface = useAppSelector(
    selectRecommendedPhotovoltaicPlantSurfaceFromElectricalPower,
  );

  const onSubmit = (data: { photovoltaicInstallationSurfaceSquareMeters: number }) => {
    dispatch(
      completePhotovoltaicInstallationSurface(data.photovoltaicInstallationSurfaceSquareMeters),
    );
  };

  const onBack = () => dispatch(revertPhotovoltaicInstallationSurface());

  if (photovoltaicKeyParameter === PhotovoltaicKeyParameter.POWER) {
    return (
      <PhotovoltaicSurfaceFromPowerForm
        recommendedSurface={recommendedSurface}
        siteSurfaceArea={surfaceArea}
        electricalPowerKWc={electricalPowerKWc}
        onSubmit={onSubmit}
        onBack={onBack}
      />
    );
  }

  return (
    <PhotovoltaicSurfaceForm siteSurfaceArea={surfaceArea} onSubmit={onSubmit} onBack={onBack} />
  );
}

export default PhotovoltaicSurfaceContainer;
