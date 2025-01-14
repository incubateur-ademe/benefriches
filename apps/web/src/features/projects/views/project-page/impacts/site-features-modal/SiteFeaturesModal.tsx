import { SiteFeatures } from "@/features/site-features/domain/siteFeatures";
import SiteFeaturesList from "@/features/site-features/views/SiteFeaturesList";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import { siteFeaturesModal } from "./createSiteFeaturesModal";

type Props = {
  siteFeaturesData?: SiteFeatures;
  isOpen: boolean;
};

const SiteFeaturesModal = ({ isOpen, siteFeaturesData }: Props) => {
  return (
    <siteFeaturesModal.Component title="Caractéristiques du site" size="large">
      {!isOpen ? null : siteFeaturesData ? (
        <SiteFeaturesList {...siteFeaturesData} />
      ) : (
        <LoadingSpinner />
      )}
    </siteFeaturesModal.Component>
  );
};

export default SiteFeaturesModal;
