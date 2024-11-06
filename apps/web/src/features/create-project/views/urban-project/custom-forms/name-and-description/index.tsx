import {
  namingCompleted,
  namingReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import { generateUrbanProjectName } from "@/features/create-project/domain/projectName";
import ProjectNameAndDescriptionForm from "@/features/create-project/views/common-views/name-and-description/ProjectNameAndDescriptionForm";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

function ProjectNameAndDescriptionFormContainer() {
  const dispatch = useAppDispatch();
  return (
    <ProjectNameAndDescriptionForm
      defaultProjectName={generateUrbanProjectName()}
      onBack={() => {
        dispatch(namingReverted());
      }}
      onSubmit={(data) => {
        dispatch(namingCompleted(data));
      }}
    />
  );
}

export default ProjectNameAndDescriptionFormContainer;
