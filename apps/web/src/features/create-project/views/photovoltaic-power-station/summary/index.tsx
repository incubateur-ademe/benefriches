import { useAppSelector } from "@/app/hooks/store.hooks";
import { useRenewableEnergyForm } from "@/features/create-project/views/photovoltaic-power-station/renewable-energy-form/useRenewableEnergyForm";

import ProjectionCreationDataSummary from "./ProjectCreationDataSummary";

function ProjectionCreationDataSummaryContainer() {
  const {
    onBack,
    onSave,
    onNavigateToStep,
    selectPhotovoltaicFinalSummaryViewData,
    selectPhotovoltaicPowerPlantSummaryNavigationDataView,
  } = useRenewableEnergyForm();
  const { projectData, siteData } = useAppSelector(selectPhotovoltaicFinalSummaryViewData);
  const { stepGroups } = useAppSelector(selectPhotovoltaicPowerPlantSummaryNavigationDataView);

  return (
    <ProjectionCreationDataSummary
      onNext={onSave}
      onBack={onBack}
      projectData={projectData}
      siteData={siteData}
      stepperGroups={stepGroups}
      onNavigateToStep={onNavigateToStep}
    />
  );
}

export default ProjectionCreationDataSummaryContainer;
