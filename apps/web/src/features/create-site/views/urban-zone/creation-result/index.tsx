import { useAppSelector } from "@/app/hooks/store.hooks";
import SiteCreationResult from "@/features/create-site/views/common-views/result/SiteCreationResult";
import { useUrbanZoneSiteForm } from "@/features/create-site/views/site-form/useUrbanZoneSiteForm";

function UrbanZoneCreationResultContainer() {
  const { onBack, selectUrbanZoneCreationResultViewData } = useUrbanZoneSiteForm();
  const viewData = useAppSelector(selectUrbanZoneCreationResultViewData);

  return (
    <SiteCreationResult
      siteId={viewData.siteId}
      siteName={viewData.siteName}
      loadingState={viewData.saveState}
      onBack={onBack}
    />
  );
}

export default UrbanZoneCreationResultContainer;
