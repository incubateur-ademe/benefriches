import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import NotFoundScreen from "@/shared/views/components/NotFound/NotFound";

import { reconversionProjectImpactsAnalysisRequested } from "../../application/project-impacts/actions";
import ProjectPage from "./ProjectPage";

type Props = {
  projectId: string;
};

export default function ProjectPageContainer({ projectId }: Props) {
  const dispatch = useAppDispatch();
  const impactsLoadingState = useAppSelector(
    (state) => state.projectImpacts.dataLoadingState.impacts,
  );

  useEffect(() => {
    void dispatch(reconversionProjectImpactsAnalysisRequested({ projectId }));
  }, [projectId, dispatch]);

  if (impactsLoadingState === "notFound") return <NotFoundScreen />;

  return <ProjectPage projectId={projectId} />;
}
