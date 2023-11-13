import { ProjectCreationStep } from "../application/createProject.reducer";
import ProjectStakeholdersIntroduction from "./stakeholders/introduction";
import OperationsFullTimeJobsInvolvedForm from "./stakeholders/operations-full-time-jobs-involved";
import SiteOperatorForm from "./stakeholders/operator";
import ProjectFullTimeJobsInvolvedForm from "./stakeholders/reconversion-full-time-jobs-involved";
import SiteReinstatementContractOwnerForm from "./stakeholders/reinstatement-contract-owner";
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
      case ProjectCreationStep.STAKEHOLDERS_FUTURE_OPERATOR:
        return <SiteOperatorForm />;
      case ProjectCreationStep.STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER:
        return <SiteReinstatementContractOwnerForm />;
      case ProjectCreationStep.STAKEHOLDERS_RECONVERSION_FULL_TIME_JOBS:
        return <ProjectFullTimeJobsInvolvedForm />;
      case ProjectCreationStep.STAKEHOLDERS_OPERATIONS_FULL_TIMES_JOBS:
        return <OperationsFullTimeJobsInvolvedForm />;
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
