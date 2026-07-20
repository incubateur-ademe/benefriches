import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import ProjectCreationDataSummary from "@/features/create-project/views/photovoltaic-power-station/summary/ProjectCreationDataSummary";

import { reconversionProjectUpdateSaved } from "../../../core/updateProject.actions";
import { updateProjectFormRenewableEnergyActions } from "../../../core/updateProject.actions";
import { selectPhotovoltaicFinalSummaryViewData } from "../../../core/updateProjectRenewableEnergy.selectors";

function ProjectUpdateDataSummaryContainer() {
  const { projectData, siteData } = useAppSelector(selectPhotovoltaicFinalSummaryViewData);

  const dispatch = useAppDispatch();

  const onNext = () => {
    void dispatch(reconversionProjectUpdateSaved());
  };

  const onBack = () => {
    dispatch(updateProjectFormRenewableEnergyActions.previousStepRequested());
  };

  return (
    <ProjectCreationDataSummary
      onNext={onNext}
      onBack={onBack}
      projectData={projectData}
      siteData={siteData}
    />
  );
}

export default ProjectUpdateDataSummaryContainer;
