import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { previousStepRequested } from "@/features/create-site/core/custom/custom.actions";
import { selectSiteCreationResultViewData } from "@/features/create-site/core/steps/final/final.selectors";

import SiteCreationResult from "./SiteCreationResult";

function SiteCreationResultContainer() {
  const { siteId, siteName, loadingState } = useAppSelector(selectSiteCreationResultViewData);
  const dispatch = useAppDispatch();

  const onBack = () => {
    dispatch(previousStepRequested());
  };

  return (
    <SiteCreationResult
      siteId={siteId}
      siteName={siteName}
      loadingState={loadingState}
      onBack={onBack}
    />
  );
}

export default SiteCreationResultContainer;
