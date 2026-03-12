import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { selectUrbanZoneNamingViewData } from "@/features/create-site/core/urban-zone/steps/naming/naming.selectors";
import { previousStepRequested } from "@/features/create-site/core/urban-zone/urban-zone.actions";
import SiteCreationResult from "@/features/create-site/views/custom/result/SiteCreationResult";

function UrbanZoneCreationResultContainer() {
  const dispatch = useAppDispatch();
  const { siteId, initialValues } = useAppSelector(selectUrbanZoneNamingViewData);

  return (
    <SiteCreationResult
      siteId={siteId}
      siteName={initialValues.name}
      loadingState="success"
      onBack={() => dispatch(previousStepRequested())}
    />
  );
}

export default UrbanZoneCreationResultContainer;
