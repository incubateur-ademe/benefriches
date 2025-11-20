import { ProjectFeatures } from "@/features/projects/domain/projects.types";
import { SiteFeatures } from "@/features/sites/core/site.types";
import SiteFeaturesList from "@/features/sites/views/SiteFeaturesList";
import Accordion from "@/shared/views/components/Accordion/Accordion";
import Dialog from "@/shared/views/components/Dialog/A11yDialog";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import ProjectFeaturesView from "../../features/ProjectFeaturesView";

type Props = {
  projectFeaturesData?: ProjectFeatures;
  siteFeaturesData?: SiteFeatures;
  dialogId: string;
};

const ProjectAndSiteFeaturesModal = ({
  projectFeaturesData,
  siteFeaturesData,
  dialogId,
}: Props) => {
  return (
    <Dialog dialogId={dialogId} title="Données du site et du projet" size="medium">
      {projectFeaturesData && siteFeaturesData ? (
        <div>
          <Accordion label={`Données du site "${siteFeaturesData.name}"`} defaultOpen>
            <SiteFeaturesList {...siteFeaturesData} />
          </Accordion>
          <Accordion label={`Données du projet "${projectFeaturesData.name}"`} defaultOpen>
            <ProjectFeaturesView projectData={projectFeaturesData} />
          </Accordion>
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </Dialog>
  );
};

export default ProjectAndSiteFeaturesModal;
