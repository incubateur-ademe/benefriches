import { useAppDispatch } from "@/app/hooks/store.hooks";
import { updateProjectFormRenewableEnergyActions } from "@/features/update-project/core/updateProject.actions";
import ProjectStakeholdersIntroduction from "@/shared/views/project-form/common/stakeholder-introduction/StakeholdersIntroduction";

function ProjectStakeholdersIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <ProjectStakeholdersIntroduction
      onNext={() => dispatch(updateProjectFormRenewableEnergyActions.nextStepRequested())}
      onBack={() => dispatch(updateProjectFormRenewableEnergyActions.previousStepRequested())}
    />
  );
}

export default ProjectStakeholdersIntroductionContainer;
