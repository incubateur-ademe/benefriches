import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import ProjectExpressCreationResult from "../../common-views/result/ProjectExpressCreationResult";

function PhotovoltaicExpressCreationResultContainer() {
  const dispatch = useAppDispatch();
  const { projectId, renewableEnergyProject, siteData } = useAppSelector(
    (state) => state.projectCreation,
  );
  const { saveState, expressData } = renewableEnergyProject;

  const onBack = () => {
    dispatch(stepRevertAttempted());
  };

  return (
    <ProjectExpressCreationResult
      projectId={projectId}
      siteName={siteData?.name ?? ""}
      loadingState={saveState}
      projectData={expressData?.projectData}
      onBack={onBack}
    />
  );
}

export default PhotovoltaicExpressCreationResultContainer;
