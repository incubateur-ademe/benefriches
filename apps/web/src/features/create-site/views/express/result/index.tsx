import { creationResultStepReverted } from "@/features/create-site/core/actions/finalStep.actions";
import { selectSiteFeatures } from "@/features/site-features/core/siteFeatures.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SiteCreationResult from "./SiteCreationResult";

function SiteCreationResultContainer() {
  const { siteData: creationData, saveLoadingState: creationLoadingState } = useAppSelector(
    (state) => state.siteCreation,
  );
  const siteData = useAppSelector(selectSiteFeatures);

  const dispatch = useAppDispatch();

  const onBack = () => {
    dispatch(creationResultStepReverted());
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
