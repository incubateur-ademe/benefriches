import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { selectUrbanZoneCreationResultViewData } from "@/features/create-site/core/urban-zone/steps/creation-result/creationResult.selectors";
import { previousStepRequested } from "@/features/create-site/core/urban-zone/urban-zone.actions";
import SiteCreationResult from "@/features/create-site/views/custom/result/SiteCreationResult";

function UrbanZoneCreationResultContainer() {
  const dispatch = useAppDispatch();
  const viewData = useAppSelector(selectUrbanZoneCreationResultViewData);

  return (
    <SiteCreationResult
      siteId={viewData.siteId}
      siteName={viewData.siteName}
      loadingState={viewData.saveState}
      onBack={() => dispatch(previousStepRequested())}
    />
  );
}

export default UrbanZoneCreationResultContainer;
