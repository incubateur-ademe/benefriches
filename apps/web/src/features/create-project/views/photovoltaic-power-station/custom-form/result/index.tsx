import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { previousStepRequested } from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectCreationResultViewData } from "@/features/create-project/core/renewable-energy/step-handlers/summary/summary-creation-result/summaryCreationResult.selector";

import ProjectCreationResult from "../../../common-views/result";

function ProjectCreationResultContainer() {
  const { projectName, saveState } = useAppSelector(selectCreationResultViewData);

  const dispatch = useAppDispatch();

  const onBack = () => {
    dispatch(previousStepRequested());
  };

  return <ProjectCreationResult projectName={projectName} saveState={saveState} onBack={onBack} />;
}

export default ProjectCreationResultContainer;
