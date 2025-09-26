import { useIsModalOpen } from "@codegouvfr/react-dsfr/Modal/useIsModalOpen";
import { useEffect } from "react";

import { fetchProjectFeatures } from "@/features/projects/application/project-features/projectFeatures.actions";
import { selectProjectFeatures } from "@/features/projects/application/project-features/projectFeatures.reducer";
import { fetchSiteFeatures } from "@/features/site-features/core/fetchSiteFeatures.action";
import { selectSiteFeatures } from "@/features/site-features/core/siteFeatures.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import ProjectAndSiteFeaturesModal from "./ProjectAndSiteFeaturesModal";

type Props = {
  siteId: string;
  projectId: string;
  dialogId: string;
};

const ProjectAndSiteFeaturesModalContainer = ({ siteId, projectId, dialogId }: Props) => {
  const projectFeatures = useAppSelector(selectProjectFeatures);
  const siteFeatures = useAppSelector(selectSiteFeatures);

  const dispatch = useAppDispatch();
  const isOpen = useIsModalOpen({ id: dialogId, isOpenedByDefault: false });

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
      dialogId={dialogId}
    />
  );
};

export default ProjectAndSiteFeaturesModalContainer;
