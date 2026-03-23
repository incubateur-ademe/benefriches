import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { stepReverted } from "@/features/create-site/core/actions/revert.action";

import SiteCreationResult from "./SiteCreationResult";

function SiteCreationResultContainer() {
  const { siteData, saveLoadingState: creationLoadingState } = useAppSelector(
    (state) => state.siteCreation,
  );
  const dispatch = useAppDispatch();

  const onBack = () => {
    dispatch(stepReverted());
  };

  return (
    <SiteCreationResult
      siteId={siteData.id}
      siteName={siteData.name ?? ""}
      loadingState={creationLoadingState}
      onBack={onBack}
    />
  );
}

export default SiteCreationResultContainer;
