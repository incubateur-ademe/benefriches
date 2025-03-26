import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { scheduleIntroductionCompleted } from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
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
        dispatch(stepRevertAttempted());
      }}
    />
  );
}

export default ProjectScheduleIntroductionContainer;
