import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";

import { evaluationPeriodUpdated } from "../../application/project-impacts/actions";
import { selectDevelopmentScoreDataView } from "../../application/project-impacts/projectDevelopmentScore.selectors";
import ProjectDevelopmentScore from "./ProjectDevelopmentScorePage";

type Props = {
  projectId: string;
};

export default function ProjectDevelopmentScoreContainer({ projectId }: Props) {
  const developmentScoreDataView = useAppSelector(selectDevelopmentScoreDataView);
  const dispatch = useAppDispatch();

  if (!developmentScoreDataView) {
    return null;
  }
  return (
    <ProjectDevelopmentScore
      onEvaluationPeriodChange={(evaluationPeriodInYears: number) => {
        void dispatch(evaluationPeriodUpdated({ evaluationPeriodInYears }));
      }}
      projectId={projectId}
      {...developmentScoreDataView}
    />
  );
}
