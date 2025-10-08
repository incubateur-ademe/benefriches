import ProjectStakeholdersIntroduction from "@/features/create-project/views/common-views/stakeholder-introduction/StakeholdersIntroduction";

import { useInformationalStepBackNext } from "../../useInformationalStepBackNext";

function ProjectStakeholdersIntroductionContainer() {
  const { onBack, onNext } = useInformationalStepBackNext();

  return <ProjectStakeholdersIntroduction onNext={onNext} onBack={onBack} />;
}

export default ProjectStakeholdersIntroductionContainer;
