import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import PhotovoltaicPowerForm from "@/features/create-project/views/photovoltaic-power-station/photovoltaic/power/PowerForm";
import PhotovoltaicPowerFromSurfaceForm from "@/features/create-project/views/photovoltaic-power-station/photovoltaic/power/PowerFromSurfaceForm";
import { updateProjectFormRenewableEnergyActions } from "@/features/update-project/core/updateProject.actions";
import { selectPhotovoltaicPowerViewData } from "@/features/update-project/core/updateProjectRenewableEnergy.selectors";

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
      updateProjectFormRenewableEnergyActions.stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER",
        answers: {
          photovoltaicInstallationElectricalPowerKWc:
            data.photovoltaicInstallationElectricalPowerKWc,
        },
      }),
    );
  };

  const onBack = () => {
    dispatch(updateProjectFormRenewableEnergyActions.previousStepRequested());
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
