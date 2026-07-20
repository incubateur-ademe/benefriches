import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import PhotovoltaicSurfaceForm from "@/features/create-project/views/photovoltaic-power-station/photovoltaic/surface/SurfaceForm";
import PhotovoltaicSurfaceFromPowerForm from "@/features/create-project/views/photovoltaic-power-station/photovoltaic/surface/SurfaceFromPowerForm";
import { updateProjectFormRenewableEnergyActions } from "@/features/update-project/core/updateProject.actions";
import { selectPhotovoltaicSurfaceViewData } from "@/features/update-project/core/updateProjectRenewableEnergy.selectors";

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
      updateProjectFormRenewableEnergyActions.stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE",
        answers: {
          photovoltaicInstallationSurfaceSquareMeters:
            data.photovoltaicInstallationSurfaceSquareMeters,
        },
      }),
    );
  };

  const onBack = () => dispatch(updateProjectFormRenewableEnergyActions.previousStepRequested());

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
