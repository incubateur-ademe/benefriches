import { useAppDispatch } from "@/app/hooks/store.hooks";
import { stepReverted } from "@/features/create-project/core/actions/actionsUtils";
import { completeExpensesIntroductionStep } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";

import ProjectExpensesIntroduction from "./ProjectExpensesIntroduction";

function ProjectExpensesIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <ProjectExpensesIntroduction
      onNext={() => {
        dispatch(completeExpensesIntroductionStep());
      }}
      onBack={() => {
        dispatch(stepReverted());
      }}
    />
  );
}

export default ProjectExpensesIntroductionContainer;
