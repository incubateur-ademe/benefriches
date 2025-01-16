import {
  completeRevenuIntroductionStep,
  revertRevenuIntroductionStep,
} from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { AppDispatch } from "@/shared/core/store-config/store";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import ProjectRevenueIntroduction from "./ProjectRevenueIntroduction";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onNext: () => {
      dispatch(completeRevenuIntroductionStep());
    },
    onBack: () => {
      dispatch(revertRevenuIntroductionStep());
    },
  };
};

function ProjectRevenueIntroductionContainer() {
  const dispatch = useAppDispatch();

  return <ProjectRevenueIntroduction {...mapProps(dispatch)} />;
}

export default ProjectRevenueIntroductionContainer;
