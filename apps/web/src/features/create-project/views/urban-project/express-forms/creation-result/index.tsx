import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import ProjectCreationResult from "../../../common-views/result/ProjectCreationResult";
import { useStepBack } from "../../custom-forms/useStepBack";

function UrbanProjectExpressCreationResultContainer() {
  const { urbanProject, projectId } = useAppSelector((state) => state.projectCreation);

  const { URBAN_PROJECT_EXPRESS_SUMMARY } = useAppSelector(
    (state) => state.projectCreation.urbanProject.steps,
  );

  const onBack = useStepBack();

  return (
    <ProjectCreationResult
      projectId={projectId}
      projectName={URBAN_PROJECT_EXPRESS_SUMMARY?.data?.name ?? ""}
      loadingState={urbanProject.saveState}
      onBack={onBack}
    />
  );
}

export default UrbanProjectExpressCreationResultContainer;
