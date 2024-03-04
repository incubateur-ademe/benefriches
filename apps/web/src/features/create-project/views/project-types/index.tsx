import ProjectTypeForm from "./ProjectTypesForm";

import { completeDevelopmentPlanCategories } from "@/features/create-project/application/createProject.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

function ProjectTypesFormContainer() {
  const dispatch = useAppDispatch();
  const siteSurfaceArea = useAppSelector(
    (state) => state.projectCreation.siteData?.surfaceArea ?? 0,
  );
  return (
    <ProjectTypeForm
      siteSurfaceArea={siteSurfaceArea}
      onSubmit={({ developmentPlanCategories }) => {
        dispatch(completeDevelopmentPlanCategories(developmentPlanCategories));
      }}
    />
  );
}

export default ProjectTypesFormContainer;
