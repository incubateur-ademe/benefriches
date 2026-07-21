import { roundToInteger } from "shared";

import { useAppSelector } from "@/app/hooks/store.hooks";
import { useRenewableEnergyForm } from "@/features/create-project/views/photovoltaic-power-station/renewable-energy-form/useRenewableEnergyForm";
import SoilsDecontaminationSurfaceArea from "@/features/create-project/views/project-form/common/soils-decontamination/surface-area/SoilsDecontaminationSurfaceArea";
import { useSurfaceAreaInputMode } from "@/features/create-project/views/useSurfaceAreaInputMode";
import { computeValueFromPercentage } from "@/shared/core/percentage/percentage";

function SoilsDecontaminationSurfaceAreaContainer() {
  const { onBack, onRequestStepCompletion, selectPVDecontaminationSurfaceAreaViewData } =
    useRenewableEnergyForm();
  const { inputMode, onInputModeChange } = useSurfaceAreaInputMode();
  const { contaminatedSurfaceArea, surfaceAreaToDecontaminateInPercentage } = useAppSelector(
    selectPVDecontaminationSurfaceAreaViewData,
  );

  const onSubmit = (surfaceArea: number) => {
    onRequestStepCompletion({
      stepId: "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA",
      answers: { decontaminatedSurfaceArea: surfaceArea },
    });
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
      onBack={onBack}
    />
  );
}

export default SoilsDecontaminationSurfaceAreaContainer;
