import { AppDispatch } from "@/app/application/store";
import {
  completeExpensesIntroductionStep,
  revertExpensesIntroductionStep,
} from "@/features/create-project/application/renewable-energy/renewableEnergy.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import ProjectExpensesIntroduction from "./ProjectCostsIntroduction";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onNext: () => {
      dispatch(completeExpensesIntroductionStep());
    },
    onBack: () => {
      dispatch(revertExpensesIntroductionStep());
    },
  };
};

function ProjectExpensesIntroductionContainer() {
  const dispatch = useAppDispatch();

  return <ProjectExpensesIntroduction {...mapProps(dispatch)} />;
}

export default ProjectExpensesIntroductionContainer;
