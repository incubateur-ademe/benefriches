import {
  stakeholderIntroductionCompleted,
  stakeholderIntroductionReverted,
} from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import ProjectStakeholdersIntroduction from "@/features/create-project/views/common-views/stakeholder-introduction/StakeholdersIntroduction";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

function ProjectStakeholdersIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <ProjectStakeholdersIntroduction
      onNext={() => dispatch(stakeholderIntroductionCompleted())}
      onBack={() => dispatch(stakeholderIntroductionReverted())}
    />
  );
}

export default ProjectStakeholdersIntroductionContainer;
