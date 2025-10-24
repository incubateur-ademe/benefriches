import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import BuildingsUseSelection from "./BuildingsUseSelection";

export default function BuildingsUseSelectionContainer() {
  const { onBack, onRequestStepCompletion, selectStepAnswers } = useProjectForm();

  const buildingsUsesSelection = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_BUILDINGS_USE_SELECTION"),
  )?.buildingsUsesSelection;

  const initialValues = buildingsUsesSelection
    ? { buildingsUses: buildingsUsesSelection }
    : undefined;

  return (
    <BuildingsUseSelection
      onSubmit={(formData) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_BUILDINGS_USE_SELECTION",
          answers: { buildingsUsesSelection: formData.buildingsUses },
        });
      }}
      onBack={onBack}
      initialValues={initialValues}
    />
  );
}
