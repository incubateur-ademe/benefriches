import { useInformationalStepBackNext } from "../../useInformationalStepBackNext";
import ProjectRevenueIntroduction from "./ProjectRevenueIntroduction";

function ProjectRevenueIntroductionContainer() {
  const { onBack, onNext } = useInformationalStepBackNext();

  return <ProjectRevenueIntroduction onNext={onNext} onBack={onBack} />;
}

export default ProjectRevenueIntroductionContainer;
