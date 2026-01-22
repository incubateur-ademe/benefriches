import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import SpacesSelectionForm from "./SpacesSelectionForm";

export default function SpacesSelectionContainer() {
  const { onBack, onRequestStepCompletion, selectSpacesSelectionViewData } = useProjectForm();

  const { selectedSpaces, selectableSoils } = useAppSelector(selectSpacesSelectionViewData);

  return (
    <SpacesSelectionForm
      onSubmit={(formData) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_SPACES_SELECTION",
          answers: { spacesSelection: formData.soils },
        });
      }}
      onBack={onBack}
      initialValues={selectedSpaces}
      selectableSoils={selectableSoils}
    />
  );
}
