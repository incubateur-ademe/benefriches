import { stepReverted } from "@/features/create-project/core/actions/actionsUtils";
import { selectShouldGoThroughOnboarding } from "@/features/projects/application/project-impacts/impactsOnboardingSkip.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import ProjectCreationResult from "../../common-views/result/ProjectCreationResult";

function PhotovoltaicExpressCreationResultContainer() {
  const dispatch = useAppDispatch();
  const { projectId, renewableEnergyProject } = useAppSelector((state) => state.projectCreation);
  const { saveState, expressData } = renewableEnergyProject;
  const shouldGoThroughOnboarding = useAppSelector(selectShouldGoThroughOnboarding);

  const onBack = () => {
    dispatch(stepReverted());
  };

  return (
    <ProjectCreationResult
      projectId={projectId}
      projectName={expressData.projectData?.name ?? ""}
      loadingState={saveState}
      onBack={onBack}
      shouldGoThroughOnboarding={shouldGoThroughOnboarding}
    />
  );
}

export default PhotovoltaicExpressCreationResultContainer;
