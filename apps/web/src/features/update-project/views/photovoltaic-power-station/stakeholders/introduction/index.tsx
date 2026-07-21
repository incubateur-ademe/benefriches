import { useAppDispatch } from "@/app/hooks/store.hooks";
import ProjectStakeholdersIntroduction from "@/features/create-project/views/project-form/common/stakeholder-introduction/StakeholdersIntroduction";
import { updateProjectFormRenewableEnergyActions } from "@/features/update-project/core/updateProject.actions";

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
