import { completeRevenuIntroductionStep } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { revenueIntroductionStepReverted } from "@/features/create-project/core/renewable-energy/actions/revert.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import ProjectRevenueIntroduction from "./ProjectRevenueIntroduction";

function ProjectRevenueIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <ProjectRevenueIntroduction
      onNext={() => {
        dispatch(completeRevenuIntroductionStep());
      }}
      onBack={() => {
        dispatch(revenueIntroductionStepReverted());
      }}
    />
  );
}

export default ProjectRevenueIntroductionContainer;
