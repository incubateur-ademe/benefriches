import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { completeExpensesIntroductionStep } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
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
        dispatch(stepRevertAttempted());
      }}
    />
  );
}

export default ProjectExpensesIntroductionContainer;
