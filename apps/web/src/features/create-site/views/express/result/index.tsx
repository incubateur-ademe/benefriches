import { stepReverted } from "@/features/create-site/core/actions/revert.action";
import { selectSiteCreationResultViewData } from "@/features/create-site/core/selectors/createSite.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SiteCreationResult from "./SiteCreationResult";

function SiteCreationResultContainer() {
  const viewData = useAppSelector(selectSiteCreationResultViewData);
  const dispatch = useAppDispatch();

  const onBack = () => {
    dispatch(stepReverted());
  };

  return (
    <SiteCreationResult
      siteId={viewData.siteId}
      siteName={viewData.siteName}
      loadingState={viewData.loadingState}
      onBack={onBack}
    />
  );
}

export default SiteCreationResultContainer;
