import { useAppSelector } from "@/app/hooks/store.hooks";
import { useCustomSiteForm } from "@/features/create-site/views/site-form/useCustomSiteForm";

import SiteSoilsCarbonStorage from "./SiteSoilsCarbonStorage";

function SiteSoilsCarbonStorageContainer() {
  const { onBack, onNext, onFetchSiteSoilsCarbonStorage } = useCustomSiteForm();
  const { carbonStorage, loadingState } = useAppSelector((state) => state.siteCarbonStorage);

  return (
    <SiteSoilsCarbonStorage
      onNext={() => {
        onNext();
      }}
      onBack={() => {
        onBack();
      }}
      fetchSiteCarbonStorage={async () => {
        await onFetchSiteSoilsCarbonStorage();
      }}
      loadingState={loadingState}
      siteCarbonStorage={carbonStorage}
    />
  );
}

export default SiteSoilsCarbonStorageContainer;
