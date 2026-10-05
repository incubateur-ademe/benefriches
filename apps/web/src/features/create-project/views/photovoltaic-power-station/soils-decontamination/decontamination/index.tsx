import { useAppSelector } from "@/app/hooks/store.hooks";
import { useRenewableEnergyForm } from "@/features/create-project/views/photovoltaic-power-station/renewable-energy-form/useRenewableEnergyForm";
import SoilsDecontaminationForm from "@/features/create-project/views/project-form/common/soils-decontamination/SoilsDecontaminationForm";
import { useSurfaceAreaInputMode } from "@/features/create-project/views/useSurfaceAreaInputMode";

function SoilsDecontaminationContainer() {
  const { inputMode, onInputModeChange } = useSurfaceAreaInputMode();
  const { onBack, onRequestStepCompletion, selectSoilsDecontaminationViewData } =
    useRenewableEnergyForm();
  const { initialValues, contaminatedSoilSurface } = useAppSelector(
    selectSoilsDecontaminationViewData,
  );

  return (
    <SoilsDecontaminationForm
      initialValues={initialValues}
      contaminatedSoilSurface={contaminatedSoilSurface}
      inputMode={inputMode}
      onInputModeChange={onInputModeChange}
      onSubmit={(answers) => {
        onRequestStepCompletion({ stepId: "RENEWABLE_ENERGY_SOILS_DECONTAMINATION", answers });
      }}
      onBack={onBack}
    />
  );
}

export default SoilsDecontaminationContainer;
