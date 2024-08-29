import { revertStep } from "../../../application/createSite.reducer";
import SiteCreationConfirmation from "./SiteCreationConfirmation";

import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

function SiteCreationConfirmationContainer() {
  const { siteData, saveLoadingState: creationLoadingState } = useAppSelector(
    (state) => state.siteCreation,
  );
  const dispatch = useAppDispatch();

  const onBack = () => {
    dispatch(revertStep());
  };

  return (
    <SiteCreationConfirmation
      siteId={siteData.id ?? ""}
      siteName={siteData.name ?? ""}
      loadingState={creationLoadingState}
      onBack={onBack}
    />
  );
}

export default SiteCreationConfirmationContainer;
