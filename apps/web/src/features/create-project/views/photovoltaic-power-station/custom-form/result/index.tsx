import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { navigateToPrevious } from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectCreationResultViewData } from "@/features/create-project/core/renewable-energy/step-handlers/summary/creationResult.selector";

import ProjectCreationResult from "../../../common-views/result";

function ProjectCreationResultContainer() {
  const { projectName, saveState } = useAppSelector(selectCreationResultViewData);

  const dispatch = useAppDispatch();

  const onBack = () => {
    dispatch(navigateToPrevious());
  };

  return <ProjectCreationResult projectName={projectName} saveState={saveState} onBack={onBack} />;
}

export default ProjectCreationResultContainer;
