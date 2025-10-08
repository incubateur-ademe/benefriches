import { useInformationalStepBackNext } from "../../useInformationalStepBackNext";
import ProjectExpensesIntroduction from "./ProjectExpensesIntroduction";

function ProjectExpensesIntroductionContainer() {
  const { onBack, onNext } = useInformationalStepBackNext();

  return <ProjectExpensesIntroduction onNext={onNext} onBack={onBack} />;
}

export default ProjectExpensesIntroductionContainer;
