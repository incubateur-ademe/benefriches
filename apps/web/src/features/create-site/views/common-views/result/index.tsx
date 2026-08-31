import { useAppSelector } from "@/app/hooks/store.hooks";
import { useCustomSiteForm } from "@/features/create-site/views/site-form/useCustomSiteForm";

import SiteCreationResult from "./SiteCreationResult";

function SiteCreationResultContainer() {
  const { onBack, selectSiteCreationResultViewData } = useCustomSiteForm();
  const { siteId, siteName, loadingState } = useAppSelector(selectSiteCreationResultViewData);

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
