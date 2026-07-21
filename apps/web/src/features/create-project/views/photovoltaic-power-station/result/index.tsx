import { useAppSelector } from "@/app/hooks/store.hooks";
import { useRenewableEnergyForm } from "@/features/create-project/views/photovoltaic-power-station/renewable-energy-form/useRenewableEnergyForm";

import ProjectCreationResult from "../../common-views/result/";

function ProjectCreationResultContainer() {
  const { onBack, selectCreationResultViewData } = useRenewableEnergyForm();
  const { projectName, saveState } = useAppSelector(selectCreationResultViewData);

  return <ProjectCreationResult projectName={projectName} saveState={saveState} onBack={onBack} />;
}

export default ProjectCreationResultContainer;
