import SiteCreationConfirmation from "./SiteCreationConfirmation";

import { useAppSelector } from "@/shared/views/hooks/store.hooks";

function SiteCreationConfirmationContainer() {
  const { siteData, saveLoadingState: creationLoadingState } = useAppSelector(
    (state) => state.siteCreation,
  );
  return (
    <SiteCreationConfirmation
      siteName={siteData.name ?? ""}
      loadingState={creationLoadingState}
    />
  );
}

export default SiteCreationConfirmationContainer;
