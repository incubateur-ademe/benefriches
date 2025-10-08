import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import ProjectExpressCreationResult from "../../../common-views/result/ProjectExpressCreationResult";
import { useStepBack } from "../../custom-forms/useStepBack";

function UrbanProjectExpressCreationResultContainer() {
  const { urbanProject, siteData, projectId } = useAppSelector((state) => state.projectCreation);

  const onBack = useStepBack();

  return (
    <ProjectExpressCreationResult
      projectId={projectId}
      siteName={siteData?.name ?? ""}
      loadingState={urbanProject.saveState}
      projectData={urbanProject.steps.URBAN_PROJECT_EXPRESS_CREATION_RESULT?.projectData}
      onBack={onBack}
    />
  );
}

export default UrbanProjectExpressCreationResultContainer;
