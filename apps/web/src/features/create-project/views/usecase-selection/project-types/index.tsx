import { DevelopmentPlanCategory } from "shared";

import { BENEFRICHES_ENV } from "@/app/envVars";
import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  developmentPlanCategoriesCompleted,
  stepReverted,
} from "@/features/create-project/core/usecase-selection/useCaseSelection.actions";
import { selectProjectTypeViewData } from "@/features/create-project/core/usecase-selection/useCaseSelection.selectors";

import ProjectTypeForm from "./ProjectTypesForm";

function ProjectTypesFormContainer() {
  const dispatch = useAppDispatch();
  const allowedDevelopmentPlanCategories =
    BENEFRICHES_ENV.allowedDevelopmentPlanCategories as DevelopmentPlanCategory[];

  const developmentPlanCategory = useAppSelector(selectProjectTypeViewData);

  return (
    <ProjectTypeForm
      initialValues={developmentPlanCategory ? { developmentPlanCategory } : undefined}
      onSubmit={({ developmentPlanCategory }) => {
        dispatch(developmentPlanCategoriesCompleted(developmentPlanCategory));
      }}
      onBack={() => dispatch(stepReverted())}
      allowedDevelopmentPlanCategories={allowedDevelopmentPlanCategories}
    />
  );
}

export default ProjectTypesFormContainer;
