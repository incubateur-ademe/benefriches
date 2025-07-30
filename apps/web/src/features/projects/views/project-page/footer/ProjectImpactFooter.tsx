import FurtherActionsSection from "./FutherActionsSection";
import ImpactComparisonSection from "./compare-impacts";

type Props = {
  siteId: string;
  projectId: string;
  evaluationPeriod?: number;
};

function ProjectImpactFooter({ siteId, projectId, evaluationPeriod }: Props) {
  return (
    <>
      <FurtherActionsSection siteId={siteId} />
      <ImpactComparisonSection projectId={projectId} evaluationPeriod={evaluationPeriod} />
    </>
  );
}

export default ProjectImpactFooter;
