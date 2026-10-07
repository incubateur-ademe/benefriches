import { useAppSelector } from "@/app/hooks/store.hooks";

import { selectDevelopmentScoreDataView } from "../../application/project-impacts/selectors/projectDevelopmentScore.selectors";
import ProjectDevelopmentScore from "./ProjectDevelopmentScorePage";

type Props = {
  projectId: string;
};

export default function ProjectDevelopmentScoreContainer({ projectId }: Props) {
  const developmentScoreDataView = useAppSelector(selectDevelopmentScoreDataView);

  if (!developmentScoreDataView) {
    return null;
  }
  return <ProjectDevelopmentScore projectId={projectId} {...developmentScoreDataView} />;
}
