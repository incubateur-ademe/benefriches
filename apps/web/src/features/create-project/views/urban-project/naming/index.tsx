import { useAppSelector } from "@/app/hooks/store.hooks";
import ProjectNameAndDescriptionForm from "@/features/create-project/views/project-form/common/name-and-description/ProjectNameAndDescriptionForm";
import { useProjectForm } from "@/features/create-project/views/project-form/useProjectForm";

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
