import { useAppSelector } from "@/app/hooks/store.hooks";
import { selectExpressCreationResultViewData } from "@/features/create-project/core/createProject.selectors";

import ProjectCreationResult from "../../../common-views/result/ProjectCreationResult";
import { useStepBack } from "../useStepBack";

function UrbanProjectExpressCreationResultContainer() {
  const { projectId, projectName, saveState, shouldGoThroughOnboarding } = useAppSelector(
    selectExpressCreationResultViewData,
  );

  const onBack = useStepBack();

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

export default UrbanProjectExpressCreationResultContainer;
