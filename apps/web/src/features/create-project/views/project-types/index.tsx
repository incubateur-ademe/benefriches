import { DevelopmentPlanCategory } from "shared";

import { BENEFRICHES_ENV } from "@/app/application/envVars";
import { completeDevelopmentPlanCategories } from "@/features/create-project/core/createProject.reducer";
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
