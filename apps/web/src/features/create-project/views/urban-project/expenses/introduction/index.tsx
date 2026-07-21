import { useProjectForm } from "@/features/create-project/views/project-form/useProjectForm";

import ProjectExpensesIntroduction from "./ProjectExpensesIntroduction";

function ProjectExpensesIntroductionContainer() {
  const { onBack, onNext } = useProjectForm();

  return <ProjectExpensesIntroduction onNext={onNext} onBack={onBack} />;
}

export default ProjectExpensesIntroductionContainer;
