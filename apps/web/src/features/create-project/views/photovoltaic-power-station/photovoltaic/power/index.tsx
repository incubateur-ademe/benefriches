import {
  completePhotovoltaicInstallationElectricalPower,
  revertPhotovoltaicInstallationElectricalPower,
} from "@/features/create-project/application/renewable-energy/renewableEnergy.actions";
import { selectPhotovoltaicPowerViewData } from "@/features/create-project/application/renewable-energy/renewableEnergy.selector";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import PhotovoltaicPowerForm from "./PowerForm";
import PhotovoltaicPowerFromSurfaceForm from "./PowerFromSurfaceForm";

function PhotovoltaicPowerContainer() {
  const dispatch = useAppDispatch();
  const {
    initialValue,
    siteSurfaceArea,
    recommendedPowerKWc,
    photovoltaicInstallationSurfaceArea,
    keyParameter,
  } = useAppSelector(selectPhotovoltaicPowerViewData);

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

  if (keyParameter === "SURFACE") {
    return (
      <PhotovoltaicPowerFromSurfaceForm
        initialValues={
          initialValue ? { photovoltaicInstallationElectricalPowerKWc: initialValue } : undefined
        }
        recommendedElectricalPowerKWc={recommendedPowerKWc}
        photovoltaicSurfaceArea={photovoltaicInstallationSurfaceArea}
        onSubmit={onSubmit}
        onBack={onBack}
      />
    );
  }

  return (
    <PhotovoltaicPowerForm
      initialValues={
        initialValue ? { photovoltaicInstallationElectricalPowerKWc: initialValue } : undefined
      }
      recommendedElectricalPowerKWc={recommendedPowerKWc}
      siteSurfaceArea={siteSurfaceArea}
      onSubmit={onSubmit}
      onBack={onBack}
    />
  );
}

export default PhotovoltaicPowerContainer;
