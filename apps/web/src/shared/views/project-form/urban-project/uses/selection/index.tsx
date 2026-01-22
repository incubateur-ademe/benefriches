import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import UsesSelection from "./UsesSelection";

export default function UsesSelectionContainer() {
  const { onBack, onRequestStepCompletion, selectStepAnswers } = useProjectForm();

  const usesSelection = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_USES_SELECTION"),
  )?.usesSelection;

  return (
    <UsesSelection
      onSubmit={(formData) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_USES_SELECTION",
          answers: { usesSelection: formData.uses },
        });
      }}
      onBack={onBack}
      initialValues={usesSelection ?? []}
    />
  );
}
