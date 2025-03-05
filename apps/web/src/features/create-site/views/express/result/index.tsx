import { selectSiteFeatures } from "@/features/site-features/core/siteFeatures.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { revertStep } from "../../../core/createSite.reducer";
import SiteCreationResult from "./SiteCreationResult";

function SiteCreationResultContainer() {
  const { siteData: creationData, saveLoadingState: creationLoadingState } = useAppSelector(
    (state) => state.siteCreation,
  );
  const siteData = useAppSelector(selectSiteFeatures);

  const dispatch = useAppDispatch();

  const onBack = () => {
    dispatch(revertStep());
  };

  return (
    <SiteCreationResult
      siteId={creationData.id}
      siteName={siteData?.name ?? ""}
      loadingState={creationLoadingState}
      onBack={onBack}
    />
  );
}

export default SiteCreationResultContainer;
