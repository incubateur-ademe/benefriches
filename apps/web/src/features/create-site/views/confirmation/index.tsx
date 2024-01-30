import { useEffect } from "react";
import { saveSiteAction } from "../../application/createSite.actions";
import SiteCreationConfirmation from "./SiteCreationConfirmation";

import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

function SiteCreationConfirmationContainer() {
  const { siteData, saveLoadingState: creationLoadingState } = useAppSelector(
    (state) => state.siteCreation,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(saveSiteAction());
  }, [dispatch]);

  return (
    <SiteCreationConfirmation
      siteId={siteData.id ?? ""}
      siteName={siteData.name ?? ""}
      loadingState={creationLoadingState}
    />
  );
}

export default SiteCreationConfirmationContainer;
