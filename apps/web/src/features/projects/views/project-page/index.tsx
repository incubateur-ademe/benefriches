import { useEffect } from "react";

import { useAppDispatch } from "@/app/hooks/store.hooks";

import {
  reconversionProjectImpactsBreakEvenLevelRequested,
  reconversionProjectImpactsRequested,
} from "../../application/project-impacts/actions";
import ProjectPage from "./ProjectPage";

type Props = {
  projectId: string;
};

export default function ProjectPageContainer({ projectId }: Props) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(reconversionProjectImpactsRequested({ projectId }));
    void dispatch(reconversionProjectImpactsBreakEvenLevelRequested({ projectId }));
  }, [projectId, dispatch]);

  return <ProjectPage projectId={projectId} />;
}
