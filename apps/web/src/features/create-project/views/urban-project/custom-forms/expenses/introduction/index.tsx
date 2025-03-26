import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { expensesIntroductionCompleted } from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import ProjectExpensesIntroduction from "./ProjectExpensesIntroduction";

function ProjectExpensesIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <ProjectExpensesIntroduction
      onNext={() => {
        dispatch(expensesIntroductionCompleted());
      }}
      onBack={() => {
        dispatch(stepRevertAttempted());
      }}
    />
  );
}

export default ProjectExpensesIntroductionContainer;
