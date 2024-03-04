import ScheduleIntroduction from "./ScheduleIntroduction";

import {
  completeScheduleIntroductionStep,
  revertScheduleIntroductionStep,
} from "@/features/create-project/application/createProject.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

function ProjectScheduleIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <ScheduleIntroduction
      onNext={() => {
        dispatch(completeScheduleIntroductionStep());
      }}
      onBack={() => {
        dispatch(revertScheduleIntroductionStep());
      }}
    />
  );
}

export default ProjectScheduleIntroductionContainer;
