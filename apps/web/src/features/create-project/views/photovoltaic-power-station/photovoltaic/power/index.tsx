import { useAppSelector } from "@/app/hooks/store.hooks";
import { useRenewableEnergyForm } from "@/features/create-project/views/photovoltaic-power-station/renewable-energy-form/useRenewableEnergyForm";

import PhotovoltaicPowerForm from "./PowerForm";
import PhotovoltaicPowerFromSurfaceForm from "./PowerFromSurfaceForm";

function PhotovoltaicPowerContainer() {
  const { onBack, onRequestStepCompletion, selectPhotovoltaicPowerViewData } =
    useRenewableEnergyForm();
  const {
    initialValue,
    siteSurfaceArea,
    recommendedPowerKWc,
    photovoltaicInstallationSurfaceArea,
    keyParameter,
  } = useAppSelector(selectPhotovoltaicPowerViewData);

  const onSubmit = (data: { photovoltaicInstallationElectricalPowerKWc: number }) => {
    onRequestStepCompletion({
      stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER",
      answers: {
        photovoltaicInstallationElectricalPowerKWc: data.photovoltaicInstallationElectricalPowerKWc,
      },
    });
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
