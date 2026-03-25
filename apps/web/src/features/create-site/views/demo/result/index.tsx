import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { previousStepRequested } from "@/features/create-site/core/demo/demoFactory";
import { selectDemoSiteCreationResultViewData } from "@/features/create-site/core/demo/steps/creation-result/creationResult.selectors";

import SiteCreationResult from "./SiteCreationResult";

function DemoSiteCreationResultContainer() {
  const { saveState, siteName, siteId, siteActivity, siteAddress } = useAppSelector(
    selectDemoSiteCreationResultViewData,
  );
  const dispatch = useAppDispatch();

  const onBack = () => {
    dispatch(previousStepRequested());
  };

  return (
    <SiteCreationResult
      siteId={siteId}
      siteName={siteName}
      loadingState={saveState}
      onErrorBack={onBack}
      siteActivity={siteActivity}
      siteAddress={siteAddress}
    />
  );
}

export default DemoSiteCreationResultContainer;
