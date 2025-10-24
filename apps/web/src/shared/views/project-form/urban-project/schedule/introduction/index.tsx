import ScheduleIntroduction from "@/shared/views/project-form/common/schedule/introduction/ScheduleIntroduction";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

function ProjectScheduleIntroductionContainer() {
  const { onBack, onNext } = useProjectForm();

  return <ScheduleIntroduction onNext={onNext} onBack={onBack} />;
}

export default ProjectScheduleIntroductionContainer;
