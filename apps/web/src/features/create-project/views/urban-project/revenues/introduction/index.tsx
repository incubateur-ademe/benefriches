import { useProjectForm } from "@/features/create-project/views/project-form/useProjectForm";

import ProjectRevenueIntroduction from "./ProjectRevenueIntroduction";

function ProjectRevenueIntroductionContainer() {
  const { onBack, onNext } = useProjectForm();

  return <ProjectRevenueIntroduction onNext={onNext} onBack={onBack} />;
}

export default ProjectRevenueIntroductionContainer;
