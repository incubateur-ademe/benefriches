import { requestStepCompletion } from "@/features/create-project/core/urban-project/urbanProject.actions";
import { selectStepAnswers } from "@/features/create-project/core/urban-project/urbanProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { useStepBack } from "../../useStepBack";
import UrbanProjectSpacesSelection from "./SpacesCategoriesSelection";

export default function UrbanProjectSpacesCategoriesSelectionContainer() {
  const dispatch = useAppDispatch();
  const { spacesCategories } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_SPACES_CATEGORIES_SELECTION")) ?? {};
  const onBack = useStepBack();

  return (
    <UrbanProjectSpacesSelection
      onSubmit={(formData) => {
        dispatch(
          requestStepCompletion({
            stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
            answers: { spacesCategories: formData.spaceCategories },
          }),
        );
      }}
      onBack={onBack}
      initialValues={spacesCategories ?? []}
    />
  );
}
