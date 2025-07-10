import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { completeScheduleIntroductionStep } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import ScheduleIntroduction from "../../../../common-views/schedule/introduction/ScheduleIntroduction";

function ProjectScheduleIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <ScheduleIntroduction
      onNext={() => {
        dispatch(completeScheduleIntroductionStep());
      }}
      onBack={() => {
        dispatch(stepRevertAttempted());
      }}
    />
  );
}

export default ProjectScheduleIntroductionContainer;
