import { useDispatch } from "react-redux";
import MixedUseNeighbourhoodCreationResult from "./MixedUseNeighbourhoodCreationResult";

import { confirmationStepReverted } from "@/features/create-project/application/mixed-use-neighbourhood/mixedUseNeighbourhoodProject.actions";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

function MixedUseNeighbourhoodCreationConfirmationContainer() {
  const dispatch = useDispatch();
  const { mixedUseNeighbourhood, projectData, siteData } = useAppSelector(
    (state) => state.projectCreation,
  );

  const onBack = () => {
    dispatch(confirmationStepReverted());
  };

  return (
    <MixedUseNeighbourhoodCreationResult
      projectId={projectData.id ?? ""}
      siteName={siteData?.name ?? ""}
      loadingState={mixedUseNeighbourhood.saveState}
      onBack={onBack}
    />
  );
}

export default MixedUseNeighbourhoodCreationConfirmationContainer;
