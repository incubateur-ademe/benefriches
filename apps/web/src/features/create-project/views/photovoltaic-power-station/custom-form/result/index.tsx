import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { ReadStateHelper } from "@/features/create-project/core/renewable-energy/helpers/readState";
import { navigateToPrevious } from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

import ProjectCreationResult from "../../../common-views/result";

function ProjectCreationResultContainer() {
  const { steps, saveState } = useAppSelector(
    (state) => state.projectCreation.renewableEnergyProject,
  );

  const dispatch = useAppDispatch();

  const projectName = ReadStateHelper.getStepAnswers(steps, "RENEWABLE_ENERGY_NAMING")?.name ?? "";

  const onBack = () => {
    dispatch(navigateToPrevious());
  };

  return <ProjectCreationResult projectName={projectName} saveState={saveState} onBack={onBack} />;
}

export default ProjectCreationResultContainer;
