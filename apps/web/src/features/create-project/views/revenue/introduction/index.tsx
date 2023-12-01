import {
  goToStep,
  ProjectCreationStep,
} from "../../../application/createProject.reducer";
import ProjectRevenueIntroduction from "./ProjectRevenueIntroduction";

import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onNext: () => {
      dispatch(goToStep(ProjectCreationStep.REVENUE_PROJECTED_YEARLY_REVENUE));
    },
  };
};

function ProjectRevenueIntroductionContainer() {
  const dispatch = useAppDispatch();

  return <ProjectRevenueIntroduction {...mapProps(dispatch)} />;
}

export default ProjectRevenueIntroductionContainer;
