import { SiteFeatures } from "@/features/sites/core/site.types";
import SiteFeaturesList from "@/features/sites/views/features/SiteFeaturesList";
import Dialog from "@/shared/views/components/Dialog/A11yDialog";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

type Props = {
  siteFeaturesData?: SiteFeatures;
  dialogId: string;
};

const ProjectAndSiteFeaturesModal = ({ siteFeaturesData, dialogId }: Props) => {
  return (
    <Dialog dialogId={dialogId} title="Données du site" size="medium">
      {siteFeaturesData ? <SiteFeaturesList {...siteFeaturesData} /> : <LoadingSpinner />}
    </Dialog>
  );
};

export default ProjectAndSiteFeaturesModal;
