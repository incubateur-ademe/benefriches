import ProjectStakeholdersIntroduction from "@/shared/views/project-form/common/stakeholder-introduction/StakeholdersIntroduction";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

function ProjectStakeholdersIntroductionContainer() {
  const { onBack, onNext } = useProjectForm();

  return <ProjectStakeholdersIntroduction onNext={onNext} onBack={onBack} />;
}

export default ProjectStakeholdersIntroductionContainer;
