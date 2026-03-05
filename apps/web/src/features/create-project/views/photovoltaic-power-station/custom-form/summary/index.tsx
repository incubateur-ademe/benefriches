import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { saveReconversionProject } from "@/features/create-project/core/renewable-energy/actions/customProjectSaved.action";
import { previousStepRequested } from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectPhotovoltaicFinalSummaryViewData } from "@/features/create-project/core/renewable-energy/step-handlers/summary/summary-final/summaryFinal.selector";

import ProjectionCreationDataSummary from "./ProjectCreationDataSummary";

function ProjectionCreationDataSummaryContainer() {
  const { projectData, siteData } = useAppSelector(selectPhotovoltaicFinalSummaryViewData);

  const dispatch = useAppDispatch();

  const onNext = () => {
    void dispatch(saveReconversionProject());
  };

  const onBack = () => {
    dispatch(previousStepRequested());
  };

  return (
    <ProjectionCreationDataSummary
      onNext={onNext}
      onBack={onBack}
      projectData={projectData}
      siteData={siteData}
    />
  );
}

export default ProjectionCreationDataSummaryContainer;
