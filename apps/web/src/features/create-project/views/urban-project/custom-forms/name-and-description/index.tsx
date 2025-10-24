import ProjectNameAndDescriptionForm from "@/features/create-project/views/common-views/name-and-description/ProjectNameAndDescriptionForm";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

function ProjectNameAndDescriptionFormContainer() {
  const { onBack, onRequestStepCompletion, selectStepAnswers } = useProjectForm();
  const stepAnswers = useAppSelector(selectStepAnswers("URBAN_PROJECT_NAMING"));

  return (
    <ProjectNameAndDescriptionForm
      onSubmit={(formData) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_NAMING",
          answers: {
            name: formData.name,
            description: formData.description,
          },
        });
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
