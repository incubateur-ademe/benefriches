import SiteCreationConfirmation from "./SiteCreationConfirmation";

import { useAppSelector } from "@/shared/views/hooks/store.hooks";

function SiteCreationConfirmationContainer() {
  const { siteData } = useAppSelector((state) => state.siteCreation);
  return <SiteCreationConfirmation siteName={siteData.name ?? ""} />;
}

export default SiteCreationConfirmationContainer;
