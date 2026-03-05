import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectPhotovoltaicSurfaceViewData } from "@/features/create-project/core/renewable-energy/step-handlers/photovoltaic/photovoltaic-surface/photovoltaicSurface.selector";

import PhotovoltaicSurfaceForm from "./SurfaceForm";
import PhotovoltaicSurfaceFromPowerForm from "./SurfaceFromPowerForm";

function PhotovoltaicSurfaceContainer() {
  const dispatch = useAppDispatch();
  const {
    initialValue,
    keyParameter,
    siteSurfaceArea,
    recommendedSurfaceArea,
    electricalPowerKWc,
  } = useAppSelector(selectPhotovoltaicSurfaceViewData);

  const onSubmit = (data: { photovoltaicInstallationSurfaceSquareMeters: number }) => {
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE",
        answers: {
          photovoltaicInstallationSurfaceSquareMeters:
            data.photovoltaicInstallationSurfaceSquareMeters,
        },
      }),
    );
  };

  const onBack = () => dispatch(previousStepRequested());

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
