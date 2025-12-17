import { useEffect } from "react";

import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import { reconversionProjectImpactsRequested } from "../../application/project-impacts/actions";
import ProjectPage from "./ProjectPage";

type Props = {
  projectId: string;
};

export default function ProjectPageContainer({ projectId }: Props) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(reconversionProjectImpactsRequested({ projectId }));
  }, [projectId, dispatch]);

  return <ProjectPage projectId={projectId} />;
}
