import ScheduleIntroduction from "./ScheduleIntroduction";

import {
  goToStep,
  ProjectCreationStep,
} from "@/features/create-project/application/createProject.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

function ProjectScheduleIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <ScheduleIntroduction
      onNext={() => dispatch(goToStep(ProjectCreationStep.SCHEDULE_PROJECTION))}
    />
  );
}

export default ProjectScheduleIntroductionContainer;
