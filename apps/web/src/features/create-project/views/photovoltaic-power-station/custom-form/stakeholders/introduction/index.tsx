import { useAppDispatch } from "@/app/hooks/store.hooks";
import {
  navigateToNext,
  navigateToPrevious,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import ProjectStakeholdersIntroduction from "@/shared/views/project-form/common/stakeholder-introduction/StakeholdersIntroduction";

function ProjectStakeholdersIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <ProjectStakeholdersIntroduction
      onNext={() => dispatch(navigateToNext())}
      onBack={() => dispatch(navigateToPrevious())}
    />
  );
}

export default ProjectStakeholdersIntroductionContainer;
