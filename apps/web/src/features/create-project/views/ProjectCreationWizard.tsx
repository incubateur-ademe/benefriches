import { ProjectCreationStep } from "../application/createProject.reducer";
import ProjectCreationConfirmation from "./confirmation";
import ProjectTypesForm from "./project-types";
import RenewableEnergyTypesForm from "./renewable-energy-types";
import Stepper from "./Stepper";

import { useAppSelector } from "@/shared/views/hooks/store.hooks";

function ProjectCreationWizard() {
  const projectCreationState = useAppSelector((state) => state.projectCreation);

  const getStepComponent = () => {
    switch (projectCreationState.step) {
      case ProjectCreationStep.PROJECT_TYPES:
        return <ProjectTypesForm />;
      case ProjectCreationStep.RENEWABLE_ENERGY_TYPES:
        return <RenewableEnergyTypesForm />;
      case ProjectCreationStep.CREATION_CONFIRMATION:
        return <ProjectCreationConfirmation />;
    }
  };

  return (
    <>
      <Stepper step={projectCreationState.step} />
      {getStepComponent()}
    </>
  );
}

export default ProjectCreationWizard;
