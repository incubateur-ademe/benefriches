import { stepReverted } from "@/features/create-project/core/actions/actionsUtils";
import { completeStakeholdersIntroductionStep } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import ProjectStakeholdersIntroduction from "@/shared/views/project-form/common/stakeholder-introduction/StakeholdersIntroduction";

function ProjectStakeholdersIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <ProjectStakeholdersIntroduction
      onNext={() => dispatch(completeStakeholdersIntroductionStep())}
      onBack={() => dispatch(stepReverted())}
    />
  );
}

export default ProjectStakeholdersIntroductionContainer;
