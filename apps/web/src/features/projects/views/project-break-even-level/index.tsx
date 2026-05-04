import { useSelector } from "react-redux";

import { selectBreakEvenLevelTabDataView } from "../../application/project-impacts/projectBreakEvenLevel.selectors";
import ProjectBreakEvenLevelTab from "./ProjectBreakEvenLevelTab";

type Props = {
  projectId: string;
};

export default function ProjectBreakEvenLevelTabContainer({ projectId }: Props) {
  const breakEvenLevelView = useSelector(selectBreakEvenLevelTabDataView);

  if (!breakEvenLevelView) {
    return null;
  }
  return <ProjectBreakEvenLevelTab projectId={projectId} {...breakEvenLevelView} />;
}
