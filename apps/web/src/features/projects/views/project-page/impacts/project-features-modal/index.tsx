import { useIsModalOpen } from "@codegouvfr/react-dsfr/Modal/useIsModalOpen";
import { useEffect } from "react";

import { fetchProjectFeatures } from "@/features/projects/application/project-features/projectFeatures.actions";
import { selectProjectFeatures } from "@/features/projects/application/project-features/projectFeatures.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import ProjectFeaturesModal from "./ProjectFeaturesModal";
import { projectFeaturesModal } from "./createProjectFeaturesModal";

type Props = {
  projectId: string;
};

const ProjectFeaturesModalContainer = ({ projectId }: Props) => {
  const projectFeatures = useAppSelector(selectProjectFeatures);

  const isOpen = useIsModalOpen(projectFeaturesModal);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isOpen) {
      void dispatch(fetchProjectFeatures({ projectId }));
    }
  }, [dispatch, isOpen, projectId]);

  return <ProjectFeaturesModal projectFeaturesData={projectFeatures} isOpen={isOpen} />;
};

export default ProjectFeaturesModalContainer;
