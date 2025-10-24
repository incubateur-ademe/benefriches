import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import ProjectRevenueIntroduction from "./ProjectRevenueIntroduction";

function ProjectRevenueIntroductionContainer() {
  const { onBack, onNext } = useProjectForm();

  return <ProjectRevenueIntroduction onNext={onNext} onBack={onBack} />;
}

export default ProjectRevenueIntroductionContainer;
