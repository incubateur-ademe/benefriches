import {
  expensesIntroductionCompleted,
  expensesIntroductionReverted,
} from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import ProjectExpensesIntroduction from "./ProjectCostsIntroduction";

function ProjectExpensesIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <ProjectExpensesIntroduction
      onNext={() => {
        dispatch(expensesIntroductionCompleted());
      }}
      onBack={() => {
        dispatch(expensesIntroductionReverted());
      }}
    />
  );
}

export default ProjectExpensesIntroductionContainer;
