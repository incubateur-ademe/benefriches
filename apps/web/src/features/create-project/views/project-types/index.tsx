import ProjectTypeForm from "./ProjectTypesForm";

import {
  goToStep,
  ProjectCreationStep,
  setDevelopmentPlanCategories,
} from "@/features/create-project/application/createProject.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

function ProjectTypesFormContainer() {
  const dispatch = useAppDispatch();
  const siteSurfaceArea = useAppSelector(
    (state) => state.projectCreation.siteData?.surfaceArea ?? 0,
  );
  return (
    <ProjectTypeForm
      siteSurfaceArea={siteSurfaceArea}
      onSubmit={({ developmentPlanCategory }) => {
        dispatch(setDevelopmentPlanCategories(developmentPlanCategory));
        dispatch(goToStep(ProjectCreationStep.RENEWABLE_ENERGY_TYPES));
      }}
    />
  );
}

export default ProjectTypesFormContainer;
