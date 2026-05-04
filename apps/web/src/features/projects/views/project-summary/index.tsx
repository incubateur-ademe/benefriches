import { useSelector } from "react-redux";

import { selectProjectSummaryDataView } from "../../application/project-impacts/projectSummary.selector";
import ProjectSummaryTab from "./ProjectSummary";

type Props = {
  projectId: string;
};

export default function ProjectSummaryTabContainer({ projectId }: Props) {
  const projectSummaryDataView = useSelector(selectProjectSummaryDataView);

  if (!projectSummaryDataView) {
    return null;
  }
  return <ProjectSummaryTab projectId={projectId} {...projectSummaryDataView} />;
}
