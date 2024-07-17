import { useEffect } from "react";
import ProjectFeaturesView from "./ProjectFeaturesView";

import { fetchProjectFeatures } from "@/features/projects/application/project-features/projectFeatures.actions";
import { selectProjectFeatures } from "@/features/projects/application/project-features/projectFeatures.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

type Props = {
  projectId: string;
};

export default function ProjectFeaturesViewContainer({ projectId }: Props) {
  const dispatch = useAppDispatch();
  const projectFeatures = useAppSelector(selectProjectFeatures);

  useEffect(() => {
    void dispatch(fetchProjectFeatures({ projectId }));
  }, [projectId, dispatch]);

  if (!projectFeatures) return null;

  return <ProjectFeaturesView projectData={projectFeatures} />;
}
