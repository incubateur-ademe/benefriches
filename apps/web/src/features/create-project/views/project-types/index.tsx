import { ProjectType } from "../../domain/project.types";
import ProjectTypeForm from "./ProjectTypesForm";

import {
  goToStep,
  ProjectCreationStep,
  setTypes,
} from "@/features/create-project/application/createProject.reducer";
import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/views/hooks/store.hooks";

function ProjectTypesFormContainer() {
  const dispatch = useAppDispatch();
  const siteSurfaceArea = useAppSelector(
    (state) => state.projectCreation.siteData?.surfaceArea ?? 0,
  );
  return (
    <ProjectTypeForm
      siteSurfaceArea={siteSurfaceArea}
      onSubmit={(data) => {
        dispatch(setTypes(data.types));
        const nextStep = data.types.includes(ProjectType.RENEWABLE_ENERGY)
          ? ProjectCreationStep.RENEWABLE_ENERGY_TYPES
          : ProjectCreationStep.CREATION_CONFIRMATION;
        dispatch(goToStep(nextStep));
      }}
    />
  );
}

export default ProjectTypesFormContainer;
