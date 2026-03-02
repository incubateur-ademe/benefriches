import { useDispatch } from "react-redux";

import { useAppSelector } from "@/app/hooks/store.hooks";
import { stepReverted } from "@/features/create-project/core/actions/actionsUtils";

import ProjectCreationResult from "../../../common-views/result";

function ProjectCreationResultContainer() {
  const { creationData, saveState } = useAppSelector(
    (state) => state.projectCreation.renewableEnergyProject,
  );

  const dispatch = useDispatch();

  const onBack = () => {
    dispatch(stepReverted());
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
