import { useIsModalOpen } from "@codegouvfr/react-dsfr/Modal/useIsModalOpen";
import { useEffect } from "react";

import { fetchProjectFeatures } from "@/features/projects/application/project-features/projectFeatures.actions";
import { selectProjectFeatures } from "@/features/projects/application/project-features/projectFeatures.reducer";
import { fetchSiteFeatures } from "@/features/site-features/core/fetchSiteFeatures.action";
import { selectSiteFeatures } from "@/features/site-features/core/siteFeatures.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import ProjectAndSiteFeaturesModal from "./ProjectAndSiteFeaturesModal";
import { projectAndSiteFeaturesModal } from "./createProjectAndSiteFeaturesModal";

type Props = {
  siteId: string;
  projectId: string;
};

const ProjectAndSiteFeaturesModalContainer = ({ siteId, projectId }: Props) => {
  const projectFeatures = useAppSelector(selectProjectFeatures);
  const siteFeatures = useAppSelector(selectSiteFeatures);

  const isOpen = useIsModalOpen(projectAndSiteFeaturesModal);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isOpen) {
      void dispatch(fetchProjectFeatures({ projectId }));
      void dispatch(fetchSiteFeatures({ siteId }));
    }
  }, [dispatch, isOpen, projectId, siteId]);

  return (
    <ProjectAndSiteFeaturesModal
      projectFeaturesData={projectFeatures}
      siteFeaturesData={siteFeatures}
      isOpen={isOpen}
    />
  );
};

export default ProjectAndSiteFeaturesModalContainer;
