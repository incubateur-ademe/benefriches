import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  navigateToPrevious,
  requestStepCompletion,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectPhotovoltaicPowerViewData } from "@/features/create-project/core/renewable-energy/step-handlers/photovoltaic/photovoltaic-power/photovoltaicPower.selector";

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
      requestStepCompletion({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER",
        answers: {
          photovoltaicInstallationElectricalPowerKWc:
            data.photovoltaicInstallationElectricalPowerKWc,
        },
      }),
    );
  };

  const onBack = () => {
    dispatch(navigateToPrevious());
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
