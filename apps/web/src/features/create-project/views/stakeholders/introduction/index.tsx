import ProjectStakeholdersIntroduction from "./StakeholdersIntroduction";

import { completeStakeholdersIntroductionStep } from "@/features/create-project/application/createProject.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

function ProjectStakeholdersIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <ProjectStakeholdersIntroduction
      onNext={() => dispatch(completeStakeholdersIntroductionStep())}
    />
  );
}

export default ProjectStakeholdersIntroductionContainer;
