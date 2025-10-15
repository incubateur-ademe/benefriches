import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import ProjectCreationResult from "../../common-views/result/ProjectCreationResult";

function PhotovoltaicExpressCreationResultContainer() {
  const dispatch = useAppDispatch();
  const { projectId, renewableEnergyProject } = useAppSelector((state) => state.projectCreation);
  const { saveState, expressData } = renewableEnergyProject;

  const onBack = () => {
    dispatch(stepRevertAttempted());
  };

  return (
    <ProjectCreationResult
      projectId={projectId}
      projectName={expressData.projectData?.name ?? ""}
      loadingState={saveState}
      onBack={onBack}
    />
  );
}

export default PhotovoltaicExpressCreationResultContainer;
