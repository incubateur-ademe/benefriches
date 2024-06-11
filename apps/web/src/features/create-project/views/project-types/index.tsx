import ProjectTypeForm from "./ProjectTypesForm";

import { completeDevelopmentPlanCategories } from "@/features/create-project/application/createProject.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

function ProjectTypesFormContainer() {
  const dispatch = useAppDispatch();
  return (
    <ProjectTypeForm
      onSubmit={({ developmentPlanCategory }) => {
        dispatch(completeDevelopmentPlanCategories(developmentPlanCategory));
      }}
    />
  );
}

export default ProjectTypesFormContainer;
