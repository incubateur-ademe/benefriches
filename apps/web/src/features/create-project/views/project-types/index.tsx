import { DevelopmentPlanCategory } from "shared";

import { completeDevelopmentPlanCategories } from "@/features/create-project/core/createProject.reducer";
import { BENEFRICHES_ENV } from "@/shared/views/envVars";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import ProjectTypeForm from "./ProjectTypesForm";

function ProjectTypesFormContainer() {
  const dispatch = useAppDispatch();
  const allowedDevelopmentPlanCategories =
    BENEFRICHES_ENV.allowedDevelopmentPlanCategories as DevelopmentPlanCategory[];
  return (
    <ProjectTypeForm
      onSubmit={({ developmentPlanCategory }) => {
        dispatch(completeDevelopmentPlanCategories(developmentPlanCategory));
      }}
      allowedDevelopmentPlanCategories={allowedDevelopmentPlanCategories}
    />
  );
}

export default ProjectTypesFormContainer;
