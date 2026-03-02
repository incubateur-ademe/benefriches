import { useAppDispatch } from "@/app/hooks/store.hooks";
import { stepReverted } from "@/features/create-project/core/actions/actionsUtils";
import { completeRevenuIntroductionStep } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";

import ProjectRevenueIntroduction from "./ProjectRevenueIntroduction";

function ProjectRevenueIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <ProjectRevenueIntroduction
      onNext={() => {
        dispatch(completeRevenuIntroductionStep());
      }}
      onBack={() => {
        dispatch(stepReverted());
      }}
    />
  );
}

export default ProjectRevenueIntroductionContainer;
