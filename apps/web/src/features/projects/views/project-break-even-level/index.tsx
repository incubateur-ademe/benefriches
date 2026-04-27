import { useEffect } from "react";
import { useSelector } from "react-redux";

import { useAppDispatch } from "@/app/hooks/store.hooks";

import { reconversionProjectImpactsBreakEvenLevelRequested } from "../../application/project-impacts/actions";
import { selectBreakEvenLevelByEvaluationPeriod } from "../../application/project-impacts/projectImpacts.reducer";
import ProjectBreakEvenLevelTab from "./ProjectBreakEvenLevelTab";

type Props = {
  projectId: string;
};

export default function ProjectBreakEvenLevelTabContainer({ projectId }: Props) {
  const dispatch = useAppDispatch();

  const breakEvenLevelView = useSelector(selectBreakEvenLevelByEvaluationPeriod);

  useEffect(() => {
    void dispatch(reconversionProjectImpactsBreakEvenLevelRequested({ projectId }));
  }, [projectId, dispatch]);

  if (!breakEvenLevelView) {
    return null;
  }
  return <ProjectBreakEvenLevelTab projectId={projectId} {...breakEvenLevelView} />;
}
