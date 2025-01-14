import { ProjectFeatures } from "@/features/projects/domain/projects.types";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import ProjectFeaturesView from "../../features/ProjectFeaturesView";
import { projectFeaturesModal } from "./createProjectFeaturesModal";

type Props = {
  projectFeaturesData?: ProjectFeatures;
  isOpen: boolean;
};

const ProjectFeaturesModal = ({ projectFeaturesData, isOpen }: Props) => {
  return (
    <projectFeaturesModal.Component title="Caractéristiques du projet" size="large">
      {!isOpen ? null : projectFeaturesData ? (
        <ProjectFeaturesView projectData={projectFeaturesData} />
      ) : (
        <LoadingSpinner />
      )}
    </projectFeaturesModal.Component>
  );
};

export default ProjectFeaturesModal;
