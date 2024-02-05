import TimetableIntroduction from "./TimetableIntroduction";

import {
  goToStep,
  ProjectCreationStep,
} from "@/features/create-project/application/createProject.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

function ProjectTimetableIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <TimetableIntroduction
      onNext={() => dispatch(goToStep(ProjectCreationStep.TIMETABLE_PROJECTION))}
    />
  );
}

export default ProjectTimetableIntroductionContainer;
