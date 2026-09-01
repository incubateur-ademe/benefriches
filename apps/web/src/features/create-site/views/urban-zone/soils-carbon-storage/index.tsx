import { useAppSelector } from "@/app/hooks/store.hooks";
import { selectSiteSoilsCarbonStorageViewData } from "@/features/create-site/core/siteSoilsCarbonStorage.reducer";
import SiteSoilsCarbonStorage from "@/features/create-site/views/common-views/spaces-and-soils/soils-carbon-storage/SiteSoilsCarbonStorage";
import { useUrbanZoneSiteForm } from "@/features/create-site/views/site-form/useUrbanZoneSiteForm";

function UrbanZoneSoilsCarbonStorageContainer() {
  const { onBack, onNext, onFetchSiteSoilsCarbonStorage } = useUrbanZoneSiteForm();
  const { carbonStorage, loadingState } = useAppSelector(selectSiteSoilsCarbonStorageViewData);

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

export default UrbanZoneSoilsCarbonStorageContainer;
