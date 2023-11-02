import {
  goToStep,
  ProjectCreationStep,
} from "../../../application/createProject.reducer";
import ProjectStakeholdersIntroduction from "./StakeholdersIntroduction";

import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

function ProjectStakeholdersIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <ProjectStakeholdersIntroduction
      onNext={() =>
        dispatch(goToStep(ProjectCreationStep.STAKEHOLDERS_FUTURE_OPERATOR))
      }
    />
  );
}

export default ProjectStakeholdersIntroductionContainer;
