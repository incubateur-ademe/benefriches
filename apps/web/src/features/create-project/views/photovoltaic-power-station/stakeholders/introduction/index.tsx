import {
  completeStakeholdersIntroductionStep,
  revertStakeholdersIntroductionStep,
} from "@/features/create-project/application/renewable-energy/renewableEnergy.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import ProjectStakeholdersIntroduction from "./StakeholdersIntroduction";

function ProjectStakeholdersIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <ProjectStakeholdersIntroduction
      onNext={() => dispatch(completeStakeholdersIntroductionStep())}
      onBack={() => dispatch(revertStakeholdersIntroductionStep())}
    />
  );
}

export default ProjectStakeholdersIntroductionContainer;
