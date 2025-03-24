import { DevelopmentPlanCategory } from "shared";

import { BENEFRICHES_ENV } from "@/shared/views/envVars";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import { developmentPlanCategoriesCompleted } from "../../core/actions/introductionStep.actions";
import ProjectTypeForm from "./ProjectTypesForm";

function ProjectTypesFormContainer() {
  const dispatch = useAppDispatch();
  const allowedDevelopmentPlanCategories =
    BENEFRICHES_ENV.allowedDevelopmentPlanCategories as DevelopmentPlanCategory[];
  return (
    <ProjectTypeForm
      onSubmit={({ developmentPlanCategory }) => {
        dispatch(developmentPlanCategoriesCompleted(developmentPlanCategory));
      }}
      allowedDevelopmentPlanCategories={allowedDevelopmentPlanCategories}
    />
  );
}

export default ProjectTypesFormContainer;
