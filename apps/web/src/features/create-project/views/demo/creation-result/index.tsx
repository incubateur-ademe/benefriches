import { useAppSelector } from "@/app/hooks/store.hooks";
import { selectDemoCreationResultViewData } from "@/features/create-project/core/demo/demoProject.selectors";

import ProjectCreationResult from "../../common-views/result/ProjectCreationResult";
import { useStepBack } from "../useStepBack";

function DemoProjectCreationResultContainer() {
  const { projectId, projectName, saveState, shouldGoThroughOnboarding } = useAppSelector(
    selectDemoCreationResultViewData,
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

export default DemoProjectCreationResultContainer;
