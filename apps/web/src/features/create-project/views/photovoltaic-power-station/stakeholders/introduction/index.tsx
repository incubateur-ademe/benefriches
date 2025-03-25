import { completeStakeholdersIntroductionStep } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { stakeholdersIntroductionStepReverted } from "@/features/create-project/core/renewable-energy/actions/revert.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import ProjectStakeholdersIntroduction from "../../../common-views/stakeholder-introduction/StakeholdersIntroduction";

function ProjectStakeholdersIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <ProjectStakeholdersIntroduction
      onNext={() => dispatch(completeStakeholdersIntroductionStep())}
      onBack={() => dispatch(stakeholdersIntroductionStepReverted())}
    />
  );
}

export default ProjectStakeholdersIntroductionContainer;
