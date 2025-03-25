import { completeExpensesIntroductionStep } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { expensesIntroductionStepReverted } from "@/features/create-project/core/renewable-energy/actions/revert.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import ProjectExpensesIntroduction from "./ProjectExpensesIntroduction";

function ProjectExpensesIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <ProjectExpensesIntroduction
      onNext={() => {
        dispatch(completeExpensesIntroductionStep());
      }}
      onBack={() => {
        dispatch(expensesIntroductionStepReverted());
      }}
    />
  );
}

export default ProjectExpensesIntroductionContainer;
