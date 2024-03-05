import {
  completeCostsIntroductionStep,
  revertCostsIntroductionStep,
} from "../../../application/createProject.reducer";
import ProjectCostsIntroduction from "./ProjectCostsIntroduction";

import { AppDispatch } from "@/app/application/store";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onNext: () => {
      dispatch(completeCostsIntroductionStep());
    },
    onBack: () => {
      dispatch(revertCostsIntroductionStep());
    },
  };
};

function ProjectCostsIntroductionContainer() {
  const dispatch = useAppDispatch();

  return <ProjectCostsIntroduction {...mapProps(dispatch)} />;
}

export default ProjectCostsIntroductionContainer;
