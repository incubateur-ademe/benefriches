import { useDispatch } from "react-redux";

import { resultsStepReverted } from "@/features/create-project/core/renewable-energy/actions/revert.actions";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import ProjectCreationResult from "../../common-views/result";

function ProjectCreationResultContainer() {
  const { creationData, saveState } = useAppSelector(
    (state) => state.projectCreation.renewableEnergyProject,
  );

  const dispatch = useDispatch();

  const onBack = () => {
    dispatch(resultsStepReverted());
  };

  return (
    <ProjectCreationResult
      projectName={creationData.name ?? ""}
      saveState={saveState}
      onBack={onBack}
    />
  );
}

export default ProjectCreationResultContainer;
