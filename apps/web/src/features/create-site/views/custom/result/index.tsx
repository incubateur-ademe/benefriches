import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { revertStep } from "../../../core/createSite.reducer";
import SiteCreationResult from "./SiteCreationResult";

function SiteCreationResultContainer() {
  const { siteData, saveLoadingState: creationLoadingState } = useAppSelector(
    (state) => state.siteCreation,
  );
  const dispatch = useAppDispatch();

  const onBack = () => {
    dispatch(revertStep());
  };

  return (
    <SiteCreationResult
      siteId={siteData.id}
      siteName={siteData.name ?? ""}
      loadingState={creationLoadingState}
      onBack={onBack}
    />
  );
}

export default SiteCreationResultContainer;
