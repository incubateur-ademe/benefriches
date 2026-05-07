import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";

import { evaluationPeriodUpdated } from "../../application/project-impacts/actions";
import { selectBreakEvenLevelTabDataView } from "../../application/project-impacts/projectBreakEvenLevel.selectors";
import ProjectBreakEvenLevelTab from "./ProjectBreakEvenLevelTab";

type Props = {
  projectId: string;
};

export default function ProjectBreakEvenLevelTabContainer({ projectId }: Props) {
  const breakEvenLevelView = useAppSelector(selectBreakEvenLevelTabDataView);
  const dispatch = useAppDispatch();

  if (!breakEvenLevelView) {
    return null;
  }
  return (
    <ProjectBreakEvenLevelTab
      projectId={projectId}
      onEvaluationPeriodChange={(evaluationPeriodInYears: number) => {
        void dispatch(evaluationPeriodUpdated({ evaluationPeriodInYears }));
      }}
      {...breakEvenLevelView}
    />
  );
}
