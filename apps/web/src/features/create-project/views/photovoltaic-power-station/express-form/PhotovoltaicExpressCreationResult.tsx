import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { stepReverted } from "@/features/create-project/core/actions/actionsUtils";
import { selectPVExpressCreationResultViewData } from "@/features/create-project/core/createProject.selectors";

import ProjectCreationResult from "../../common-views/result/ProjectCreationResult";

function PhotovoltaicExpressCreationResultContainer() {
  const dispatch = useAppDispatch();
  const { projectId, projectName, saveState, shouldGoThroughOnboarding } = useAppSelector(
    selectPVExpressCreationResultViewData,
  );

  const onBack = () => {
    dispatch(stepReverted());
  };

  return (
    <ProjectCreationResult
      projectId={projectId}
      projectName={projectName}
      loadingState={saveState}
      onBack={onBack}
      shouldGoThroughOnboarding={shouldGoThroughOnboarding}
    />
  );
}

export default PhotovoltaicExpressCreationResultContainer;
