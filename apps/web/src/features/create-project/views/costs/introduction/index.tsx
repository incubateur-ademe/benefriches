import {
  goToStep,
  ProjectCreationStep,
} from "../../../application/createProject.reducer";
import ProjectCostsIntroduction from "./ProjectCostsIntroduction";

import { ProjectSite } from "@/features/create-project/domain/project.types";
import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch, projectSite: ProjectSite | null) => {
  return {
    onNext: () => {
      const nextStep = projectSite?.isFriche
        ? ProjectCreationStep.COSTS_REINSTATEMENT
        : ProjectCreationStep.COSTS_PHOTOVOLTAIC_PANELS_INSTALLATION;
      dispatch(goToStep(nextStep));
    },
  };
};

function ProjectCostsIntroductionContainer() {
  const dispatch = useAppDispatch();
  const projectSite = useAppSelector((state) => state.projectCreation.siteData);

  return <ProjectCostsIntroduction {...mapProps(dispatch, projectSite)} />;
}

export default ProjectCostsIntroductionContainer;
