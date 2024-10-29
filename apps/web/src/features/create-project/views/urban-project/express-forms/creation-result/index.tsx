import { useDispatch } from "react-redux";

import { resultStepReverted } from "@/features/create-project/application/urban-project/urbanProject.actions";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import UrbanProjectCreationResult from "./UrbanProjectCreationResult";

function UrbanProjectCreationResultContainer() {
  const dispatch = useDispatch();
  const { urbanProject, siteData, projectId } = useAppSelector((state) => state.projectCreation);

  const onBack = () => {
    dispatch(resultStepReverted());
  };

  return (
    <UrbanProjectCreationResult
      projectId={projectId}
      siteName={siteData?.name ?? ""}
      loadingState={urbanProject.saveState}
      onBack={onBack}
    />
  );
}

export default UrbanProjectCreationResultContainer;
