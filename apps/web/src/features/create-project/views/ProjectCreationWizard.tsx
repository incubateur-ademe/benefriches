import { ProjectCreationStep } from "../application/createProject.reducer";
import ProjectStakeholdersIntroduction from "./stakeholders/introduction";
import ProjectCreationConfirmation from "./confirmation";
import ProjectTypesForm from "./project-types";
import RenewableEnergyTypesForm from "./renewable-energy-types";
import Stepper from "./Stepper";

import { useAppSelector } from "@/shared/views/hooks/store.hooks";

function ProjectCreationWizard() {
  const projectCreationStep = useAppSelector(
    (state) => state.projectCreation.step,
  );

  const getStepComponent = () => {
    switch (projectCreationStep) {
      case ProjectCreationStep.PROJECT_TYPES:
        return <ProjectTypesForm />;
      case ProjectCreationStep.RENEWABLE_ENERGY_TYPES:
        return <RenewableEnergyTypesForm />;
      case ProjectCreationStep.STAKEHOLDERS_INTRODUCTION:
        return <ProjectStakeholdersIntroduction />;
      case ProjectCreationStep.CREATION_CONFIRMATION:
        return <ProjectCreationConfirmation />;
    }
  };

  return (
    <>
      <Stepper step={projectCreationStep} />
      {getStepComponent()}
    </>
  );
}

export default ProjectCreationWizard;
