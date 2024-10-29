import {
  completeScheduleIntroductionStep,
  revertScheduleIntroductionStep,
} from "@/features/create-project/application/renewable-energy/renewableEnergy.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import ScheduleIntroduction from "./ScheduleIntroduction";

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
