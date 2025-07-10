import { useDispatch } from "react-redux";

import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import ProjectCreationResult from "../../../common-views/result";

function ProjectCreationResultContainer() {
  const { creationData, saveState } = useAppSelector(
    (state) => state.projectCreation.renewableEnergyProject,
  );

  const dispatch = useDispatch();

  const onBack = () => {
    dispatch(stepRevertAttempted());
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
