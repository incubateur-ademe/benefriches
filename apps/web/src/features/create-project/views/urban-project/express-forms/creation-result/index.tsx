import { useEffect } from "react";

import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { fetchProjectFeatures } from "@/features/projects/application/project-features/projectFeatures.actions";
import { selectProjectFeatures } from "@/features/projects/application/project-features/projectFeatures.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import UrbanProjectCreationResult from "./UrbanProjectCreationResult";

function UrbanProjectCreationResultContainer() {
  const dispatch = useAppDispatch();
  const { urbanProject, siteData, projectId } = useAppSelector((state) => state.projectCreation);

  const projectFeatures = useAppSelector(selectProjectFeatures);

  const onBack = () => {
    dispatch(stepRevertAttempted());
  };

  useEffect(() => {
    if (urbanProject.saveState === "success") {
      void dispatch(fetchProjectFeatures({ projectId }));
    }
  }, [dispatch, urbanProject.saveState, projectId]);

  return (
    <UrbanProjectCreationResult
      projectId={projectId}
      projectName={urbanProject.expressData.name ?? ""}
      siteName={siteData?.name ?? ""}
      loadingState={urbanProject.saveState}
      projectFeatures={projectFeatures}
      onBack={onBack}
    />
  );
}

export default UrbanProjectCreationResultContainer;
