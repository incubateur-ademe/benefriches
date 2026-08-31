import { useAppSelector } from "@/app/hooks/store.hooks";
import { useDemoSiteForm } from "@/features/create-site/views/site-form/useDemoSiteForm";

import SiteCreationResult from "./SiteCreationResult";

function DemoSiteCreationResultContainer() {
  const { onBack, selectDemoSiteCreationResultViewData } = useDemoSiteForm();
  const { saveState, siteName, siteId, siteActivity, siteAddress } = useAppSelector(
    selectDemoSiteCreationResultViewData,
  );

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
