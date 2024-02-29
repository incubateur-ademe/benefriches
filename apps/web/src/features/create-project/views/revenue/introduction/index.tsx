import { completeRevenuIntroductionStep } from "../../../application/createProject.reducer";
import ProjectRevenueIntroduction from "./ProjectRevenueIntroduction";

import { AppDispatch } from "@/app/application/store";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onNext: () => {
      dispatch(completeRevenuIntroductionStep());
    },
  };
};

function ProjectRevenueIntroductionContainer() {
  const dispatch = useAppDispatch();

  return <ProjectRevenueIntroduction {...mapProps(dispatch)} />;
}

export default ProjectRevenueIntroductionContainer;
