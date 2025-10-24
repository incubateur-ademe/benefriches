import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import UrbanProjectSpacesSelection from "./SpacesCategoriesSelection";

export default function UrbanProjectSpacesCategoriesSelectionContainer() {
  const { onBack, onRequestStepCompletion, selectStepAnswers } = useProjectForm();

  const spacesCategories = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_SPACES_CATEGORIES_SELECTION"),
  )?.spacesCategories;

  return (
    <UrbanProjectSpacesSelection
      onSubmit={(formData) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
          answers: { spacesCategories: formData.spaceCategories },
        });
      }}
      onBack={onBack}
      initialValues={spacesCategories ?? []}
    />
  );
}
