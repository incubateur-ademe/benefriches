import { roundToInteger } from "shared";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import SoilsDecontaminationSurfaceArea from "@/features/create-project/views/project-form/common/soils-decontamination/surface-area/SoilsDecontaminationSurfaceArea";
import { updateProjectFormRenewableEnergyActions } from "@/features/update-project/core/updateProject.actions";
import { selectPVDecontaminationSurfaceAreaViewData } from "@/features/update-project/core/updateProjectRenewableEnergy.selectors";
import { useSurfaceAreaInputMode } from "@/features/update-project/views/photovoltaic-power-station/useSurfaceAreaInputMode";
import { computeValueFromPercentage } from "@/shared/core/percentage/percentage";

function SoilsDecontaminationSurfaceAreaContainer() {
  const { inputMode, onInputModeChange } = useSurfaceAreaInputMode();
  const dispatch = useAppDispatch();
  const { contaminatedSurfaceArea, surfaceAreaToDecontaminateInPercentage } = useAppSelector(
    selectPVDecontaminationSurfaceAreaViewData,
  );

  const onSubmit = (surfaceArea: number) => {
    dispatch(
      updateProjectFormRenewableEnergyActions.stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA",
        answers: { decontaminatedSurfaceArea: surfaceArea },
      }),
    );
  };

  const getInitialValues = () => {
    if (surfaceAreaToDecontaminateInPercentage === undefined) {
      return undefined;
    }
    return {
      surfaceArea:
        inputMode === "percentage"
          ? surfaceAreaToDecontaminateInPercentage
          : roundToInteger(
              computeValueFromPercentage(
                surfaceAreaToDecontaminateInPercentage,
                contaminatedSurfaceArea,
              ),
            ),
    };
  };

  return (
    <SoilsDecontaminationSurfaceArea
      initialValues={getInitialValues()}
      contaminatedSoilSurface={contaminatedSurfaceArea}
      inputMode={inputMode}
      onInputModeChange={onInputModeChange}
      onSubmit={onSubmit}
      onBack={() => dispatch(updateProjectFormRenewableEnergyActions.previousStepRequested())}
    />
  );
}

export default SoilsDecontaminationSurfaceAreaContainer;
