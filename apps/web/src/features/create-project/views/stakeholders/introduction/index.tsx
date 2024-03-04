import ProjectStakeholdersIntroduction from "./StakeholdersIntroduction";

import {
  completeStakeholdersIntroductionStep,
  revertStakeholdersIntroductionStep,
} from "@/features/create-project/application/createProject.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

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
