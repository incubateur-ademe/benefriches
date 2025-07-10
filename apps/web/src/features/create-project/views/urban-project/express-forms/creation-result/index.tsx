import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import ProjectExpressCreationResult from "../../../common-views/result/ProjectExpressCreationResult";

function UrbanProjectCreationResultContainer() {
  const dispatch = useAppDispatch();
  const { urbanProject, siteData, projectId } = useAppSelector((state) => state.projectCreation);

  const onBack = () => {
    dispatch(stepRevertAttempted());
  };

  return (
    <ProjectExpressCreationResult
      projectId={projectId}
      siteName={siteData?.name ?? ""}
      loadingState={urbanProject.saveState}
      projectData={urbanProject.expressData.projectData}
      onBack={onBack}
    />
  );
}

export default UrbanProjectCreationResultContainer;
