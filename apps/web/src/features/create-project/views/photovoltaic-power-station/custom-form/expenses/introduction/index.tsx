import { useAppDispatch } from "@/app/hooks/store.hooks";
import {
  navigateToNext,
  navigateToPrevious,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

import ProjectExpensesIntroduction from "./ProjectExpensesIntroduction";

function ProjectExpensesIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <ProjectExpensesIntroduction
      onNext={() => {
        dispatch(navigateToNext());
      }}
      onBack={() => {
        dispatch(navigateToPrevious());
      }}
    />
  );
}

export default ProjectExpensesIntroductionContainer;
