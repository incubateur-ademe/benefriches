import { useDispatch } from "react-redux";

import { finalSummaryReverted } from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import {
  selectProjectName,
  selectSaveState,
} from "@/features/create-project/core/urban-project/selectors/urbanProject.selectors";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import ProjectCreationResult from "../../../common-views/result";

function ProjectCreationResultContainer() {
  const saveState = useAppSelector(selectSaveState);
  const projectName = useAppSelector(selectProjectName);

  const dispatch = useDispatch();

  const onBack = () => {
    dispatch(finalSummaryReverted());
  };

  return <ProjectCreationResult projectName={projectName} saveState={saveState} onBack={onBack} />;
}

export default ProjectCreationResultContainer;
