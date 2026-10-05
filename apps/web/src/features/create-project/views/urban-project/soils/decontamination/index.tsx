import { useAppSelector } from "@/app/hooks/store.hooks";
import SoilsDecontaminationForm from "@/features/create-project/views/project-form/common/soils-decontamination/SoilsDecontaminationForm";
import { useProjectForm } from "@/features/create-project/views/project-form/useProjectForm";
import { useSurfaceAreaInputMode } from "@/features/create-project/views/useSurfaceAreaInputMode";

function SoilsDecontaminationContainer() {
  const { inputMode, onInputModeChange } = useSurfaceAreaInputMode();
  const { onBack, onRequestStepCompletion, selectSoilsDecontaminationViewData } = useProjectForm();
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
        onRequestStepCompletion({ stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION", answers });
      }}
      onBack={onBack}
    />
  );
}

export default SoilsDecontaminationContainer;
