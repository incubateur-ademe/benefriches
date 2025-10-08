import ScheduleIntroduction from "@/features/create-project/views/common-views/schedule/introduction/ScheduleIntroduction";

import { useInformationalStepBackNext } from "../../useInformationalStepBackNext";

function ProjectScheduleIntroductionContainer() {
  const { onBack, onNext } = useInformationalStepBackNext();

  return <ScheduleIntroduction onNext={onNext} onBack={onBack} />;
}

export default ProjectScheduleIntroductionContainer;
