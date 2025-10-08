import { requestStepCompletion } from "@/features/create-project/core/urban-project/urbanProject.actions";
import { selectStepAnswers } from "@/features/create-project/core/urban-project/urbanProject.selectors";
import ProjectNameAndDescriptionForm from "@/features/create-project/views/common-views/name-and-description/ProjectNameAndDescriptionForm";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { useStepBack } from "../useStepBack";

function ProjectNameAndDescriptionFormContainer() {
  const dispatch = useAppDispatch();
  const stepAnswers = useAppSelector(selectStepAnswers("URBAN_PROJECT_NAMING"));

  const onBack = useStepBack();
  return (
    <ProjectNameAndDescriptionForm
      onSubmit={(formData) => {
        dispatch(
          requestStepCompletion({
            stepId: "URBAN_PROJECT_NAMING",
            answers: {
              name: formData.name,
              description: formData.description,
            },
          }),
        );
      }}
      onBack={onBack}
      initialValues={{
        name: stepAnswers?.name ?? "",
        description: stepAnswers?.description,
      }}
    />
  );
}

export default ProjectNameAndDescriptionFormContainer;
