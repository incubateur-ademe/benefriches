import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import ProjectExpensesIntroduction from "./ProjectExpensesIntroduction";

function ProjectExpensesIntroductionContainer() {
  const { onBack, onNext } = useProjectForm();

  return <ProjectExpensesIntroduction onNext={onNext} onBack={onBack} />;
}

export default ProjectExpensesIntroductionContainer;
