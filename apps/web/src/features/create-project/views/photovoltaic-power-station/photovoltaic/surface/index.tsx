import { useAppSelector } from "@/app/hooks/store.hooks";
import { useRenewableEnergyForm } from "@/features/create-project/views/photovoltaic-power-station/renewable-energy-form/useRenewableEnergyForm";

import PhotovoltaicSurfaceForm from "./SurfaceForm";
import PhotovoltaicSurfaceFromPowerForm from "./SurfaceFromPowerForm";

function PhotovoltaicSurfaceContainer() {
  const { onBack, onRequestStepCompletion, selectPhotovoltaicSurfaceViewData } =
    useRenewableEnergyForm();
  const {
    initialValue,
    keyParameter,
    siteSurfaceArea,
    recommendedSurfaceArea,
    electricalPowerKWc,
  } = useAppSelector(selectPhotovoltaicSurfaceViewData);

  const onSubmit = (data: { photovoltaicInstallationSurfaceSquareMeters: number }) => {
    onRequestStepCompletion({
      stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE",
      answers: {
        photovoltaicInstallationSurfaceSquareMeters:
          data.photovoltaicInstallationSurfaceSquareMeters,
      },
    });
  };

  if (keyParameter === "POWER") {
    return (
      <PhotovoltaicSurfaceFromPowerForm
        initialValues={{ photovoltaicInstallationSurfaceSquareMeters: initialValue }}
        recommendedSurface={recommendedSurfaceArea}
        siteSurfaceArea={siteSurfaceArea}
        electricalPowerKWc={electricalPowerKWc}
        onSubmit={onSubmit}
        onBack={onBack}
      />
    );
  }

  return (
    <PhotovoltaicSurfaceForm
      initialValues={
        initialValue ? { photovoltaicInstallationSurfaceSquareMeters: initialValue } : undefined
      }
      siteSurfaceArea={siteSurfaceArea}
      onSubmit={onSubmit}
      onBack={onBack}
    />
  );
}

export default PhotovoltaicSurfaceContainer;
