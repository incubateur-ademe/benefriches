import { DevelopmentPlanCategory } from "shared";

import { BENEFRICHES_ENV } from "@/shared/views/envVars";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { developmentPlanCategoriesCompleted } from "../../core/actions/introductionStep.actions";
import { selectProjectDevelopmentPlanCategory } from "../../core/createProject.selectors";
import ProjectTypeForm from "./ProjectTypesForm";

function ProjectTypesFormContainer() {
  const dispatch = useAppDispatch();
  const allowedDevelopmentPlanCategories =
    BENEFRICHES_ENV.allowedDevelopmentPlanCategories as DevelopmentPlanCategory[];
  const developmentPlanCategory = useAppSelector(selectProjectDevelopmentPlanCategory);

  return (
    <ProjectTypeForm
      initialValues={developmentPlanCategory ? { developmentPlanCategory } : undefined}
      onSubmit={({ developmentPlanCategory }) => {
        dispatch(developmentPlanCategoriesCompleted(developmentPlanCategory));
      }}
      allowedDevelopmentPlanCategories={allowedDevelopmentPlanCategories}
    />
  );
}

export default ProjectTypesFormContainer;
