import {
  scheduleIntroductionCompleted,
  scheduleIntroductionReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import ScheduleIntroduction from "@/features/create-project/views/common-views/schedule/introduction/ScheduleIntroduction";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

function ProjectScheduleIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <ScheduleIntroduction
      onNext={() => {
        dispatch(scheduleIntroductionCompleted());
      }}
      onBack={() => {
        dispatch(scheduleIntroductionReverted());
      }}
    />
  );
}

export default ProjectScheduleIntroductionContainer;
