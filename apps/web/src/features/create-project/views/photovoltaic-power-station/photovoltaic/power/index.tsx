import {
  completePhotovoltaicInstallationElectricalPower,
  revertPhotovoltaicInstallationElectricalPower,
} from "@/features/create-project/application/createProject.reducer";
import {
  selectPhotovoltaicPanelsSurfaceArea,
  selectSiteSurfaceArea,
} from "@/features/create-project/application/createProject.selectors";
import {
  selectPhotovoltaicPlantFeaturesKeyParameter,
  selectRecommendedPowerKWcFromPhotovoltaicPlantSurfaceArea,
  selectRecommendedPowerKWcFromSiteSurfaceArea,
} from "@/features/create-project/application/pvFeatures.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import PhotovoltaicPowerForm from "./PowerForm";
import PhotovoltaicPowerFromSurfaceForm from "./PowerFromSurfaceForm";

function PhotovoltaicPowerContainer() {
  const dispatch = useAppDispatch();
  const recommendedElectricalPowerKWc = useAppSelector(
    selectRecommendedPowerKWcFromPhotovoltaicPlantSurfaceArea,
  );
  const recommendedElectricalPowerKWcFromSiteSurfaceArea = useAppSelector(
    selectRecommendedPowerKWcFromSiteSurfaceArea,
  );
  const siteSurfaceArea = useAppSelector(selectSiteSurfaceArea);
  const surfaceSquareMeters = useAppSelector(selectPhotovoltaicPanelsSurfaceArea);
  const photovoltaicKeyParameter = useAppSelector(selectPhotovoltaicPlantFeaturesKeyParameter);

  const onSubmit = (data: { photovoltaicInstallationElectricalPowerKWc: number }) => {
    dispatch(
      completePhotovoltaicInstallationElectricalPower(
        data.photovoltaicInstallationElectricalPowerKWc,
      ),
    );
  };

  const onBack = () => {
    dispatch(revertPhotovoltaicInstallationElectricalPower());
  };

  if (photovoltaicKeyParameter === "SURFACE") {
    return (
      <PhotovoltaicPowerFromSurfaceForm
        recommendedElectricalPowerKWc={recommendedElectricalPowerKWc}
        photovoltaicSurfaceArea={surfaceSquareMeters}
        onSubmit={onSubmit}
        onBack={onBack}
      />
    );
  }

  return (
    <PhotovoltaicPowerForm
      recommendedElectricalPowerKWc={recommendedElectricalPowerKWcFromSiteSurfaceArea}
      siteSurfaceArea={siteSurfaceArea}
      onSubmit={onSubmit}
      onBack={onBack}
    />
  );
}

export default PhotovoltaicPowerContainer;
