import { useAppDispatch } from "@/app/hooks/store.hooks";
import {
  nextStepRequested,
  previousStepRequested,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

import ProjectRevenueIntroduction from "./ProjectRevenueIntroduction";

function ProjectRevenueIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <ProjectRevenueIntroduction
      onNext={() => {
        dispatch(nextStepRequested());
      }}
      onBack={() => {
        dispatch(previousStepRequested());
      }}
    />
  );
}

export default ProjectRevenueIntroductionContainer;
