import ScheduleIntroduction from "@/features/create-project/views/common-views/schedule/introduction/ScheduleIntroduction";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

function ProjectScheduleIntroductionContainer() {
  const { onBack, onNext } = useProjectForm();

  return <ScheduleIntroduction onNext={onNext} onBack={onBack} />;
}

export default ProjectScheduleIntroductionContainer;
