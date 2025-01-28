import {
  completeExpensesIntroductionStep,
  revertExpensesIntroductionStep,
} from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
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
        dispatch(revertExpensesIntroductionStep());
      }}
    />
  );
}

export default ProjectExpensesIntroductionContainer;
