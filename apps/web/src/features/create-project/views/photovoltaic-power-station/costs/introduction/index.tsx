import {
  completeExpensesIntroductionStep,
  revertExpensesIntroductionStep,
} from "../../../../application/createProject.reducer";
import ProjectExpensesIntroduction from "./ProjectCostsIntroduction";

import { AppDispatch } from "@/app/application/store";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

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
