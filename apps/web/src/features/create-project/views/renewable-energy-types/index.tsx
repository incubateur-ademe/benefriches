import { RenewableEnergyType } from "../../domain/project.types";
import ProjectTypeForm from "./RenewableEnergyTypeForm";

import {
  goToStep,
  ProjectCreationStep,
  setRenewableEnergyTypes,
} from "@/features/create-project/application/createProject.reducer";
import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/views/hooks/store.hooks";

function ProjectRenewableEnergyTypesFormContainer() {
  const dispatch = useAppDispatch();
  const siteSurfaceArea = useAppSelector(
    (state) => state.projectCreation.siteData?.surfaceArea ?? 0,
  );
  return (
    <ProjectTypeForm
      siteSurfaceArea={siteSurfaceArea}
      onSubmit={(data) => {
        const nextStep = data.renewableEnergyTypes.includes(
          RenewableEnergyType.PHOTOVOLTAIC,
        )
          ? ProjectCreationStep.PHOTOVOLTAIC_KEY_PARAMETER
          : ProjectCreationStep.CREATION_CONFIRMATION;
        dispatch(setRenewableEnergyTypes(data.renewableEnergyTypes));
        dispatch(goToStep(nextStep));
      }}
    />
  );
}

export default ProjectRenewableEnergyTypesFormContainer;
