import { selectShouldGoThroughOnboarding } from "@/features/projects/application/project-impacts/impactsOnboardingSkip.selectors";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import ProjectCreationResult from "../../../common-views/result/ProjectCreationResult";
import { useStepBack } from "../useStepBack";

function UrbanProjectExpressCreationResultContainer() {
  const { urbanProject, projectId } = useAppSelector((state) => state.projectCreation);

  const { URBAN_PROJECT_EXPRESS_SUMMARY } = useAppSelector(
    (state) => state.projectCreation.urbanProject.steps,
  );
  const shouldGoThroughOnboarding = useAppSelector(selectShouldGoThroughOnboarding);

  const onBack = useStepBack();

  return (
    <ProjectCreationResult
      projectId={projectId}
      projectName={URBAN_PROJECT_EXPRESS_SUMMARY?.data?.name ?? ""}
      loadingState={urbanProject.saveState}
      onBack={onBack}
      shouldGoThroughOnboarding={shouldGoThroughOnboarding}
    />
  );
}

export default UrbanProjectExpressCreationResultContainer;
