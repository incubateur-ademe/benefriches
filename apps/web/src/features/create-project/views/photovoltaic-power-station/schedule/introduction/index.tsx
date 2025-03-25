import { completeScheduleIntroductionStep } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { scheduleIntroductionStepReverted } from "@/features/create-project/core/renewable-energy/actions/revert.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import ScheduleIntroduction from "../../../common-views/schedule/introduction/ScheduleIntroduction";

function ProjectScheduleIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <ScheduleIntroduction
      onNext={() => {
        dispatch(completeScheduleIntroductionStep());
      }}
      onBack={() => {
        dispatch(scheduleIntroductionStepReverted());
      }}
    />
  );
}

export default ProjectScheduleIntroductionContainer;
