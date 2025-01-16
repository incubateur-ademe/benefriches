import {
  completeRevenuIntroductionStep,
  revertRevenuIntroductionStep,
} from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import ProjectRevenueIntroduction from "./ProjectRevenueIntroduction";

function ProjectRevenueIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <ProjectRevenueIntroduction
      onNext={() => {
        dispatch(completeRevenuIntroductionStep());
      }}
      onBack={() => {
        dispatch(revertRevenuIntroductionStep());
      }}
    />
  );
}

export default ProjectRevenueIntroductionContainer;
