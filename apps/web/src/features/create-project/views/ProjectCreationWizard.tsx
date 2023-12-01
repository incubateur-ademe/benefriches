import { ProjectCreationStep } from "../application/createProject.reducer";
import ProjectCostsIntroduction from "./costs/introduction";
import PhotovoltaicPanelsInstallationCostsForm from "./costs/photovoltaic-panels-installation-costs";
import ReinstatementsCostsForm from "./costs/reinstatement-costs";
import YearlyProjectedCostsForm from "./costs/yearly-projected-costs";
import PhotovoltaicContractDurationContainer from "./photovoltaic/contract-duration";
import PhotovoltaicExpectedAnnualProductionContainer from "./photovoltaic/expected-annual-production";
import PhotovoltaicKeyParameter from "./photovoltaic/key-parameter";
import PhotovoltaicPower from "./photovoltaic/power";
import PhotovoltaicSurface from "./photovoltaic/surface";
import ProjectFinancialAssistanceRevenueForm from "./revenue/financial-assistance";
import ProjectRevenueIntroduction from "./revenue/introduction";
import ProjectYearlyProjectedRevenueForm from "./revenue/yearly-projected-revenue";
import ProjectFullTimeJobsInvolvedForm from "./stakeholders/conversion-full-time-jobs-involved";
import ProjectStakeholdersIntroduction from "./stakeholders/introduction";
import OperationsFullTimeJobsInvolvedForm from "./stakeholders/operations-full-time-jobs-involved";
import SiteOperatorForm from "./stakeholders/operator";
import SiteReinstatementContractOwnerForm from "./stakeholders/reinstatement-contract-owner";
import ProjectCreationConfirmation from "./confirmation";
import ProjectDocumentsContainer from "./documents";
import ProjectNameAndDescriptionForm from "./name-and-description";
import ProjectTypesForm from "./project-types";
import RenewableEnergyTypesForm from "./renewable-energy-types";
import ProjectSoilsSurfaceAreasContainer from "./soils-surface-areas";
import Stepper from "./Stepper";

import { useAppSelector } from "@/shared/views/hooks/store.hooks";

function ProjectCreationWizard() {
  const projectCreationStep = useAppSelector(
    (state) => state.projectCreation.step,
  );

  const getStepComponent = () => {
    switch (projectCreationStep) {
      case ProjectCreationStep.DOCUMENTS:
        return <ProjectDocumentsContainer />;
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
      case ProjectCreationStep.COSTS_INTRODUCTION:
        return <ProjectCostsIntroduction />;
      case ProjectCreationStep.COSTS_REINSTATEMENT:
        return <ReinstatementsCostsForm />;
      case ProjectCreationStep.COSTS_PHOTOVOLTAIC_PANELS_INSTALLATION:
        return <PhotovoltaicPanelsInstallationCostsForm />;
      case ProjectCreationStep.COSTS_PROJECTED_YEARLY_COSTS:
        return <YearlyProjectedCostsForm />;
      case ProjectCreationStep.REVENUE_INTRODUCTION:
        return <ProjectRevenueIntroduction />;
      case ProjectCreationStep.REVENUE_PROJECTED_YEARLY_REVENUE:
        return <ProjectYearlyProjectedRevenueForm />;
      case ProjectCreationStep.REVENUE_FINANCIAL_ASSISTANCE:
        return <ProjectFinancialAssistanceRevenueForm />;
      case ProjectCreationStep.NAMING:
        return <ProjectNameAndDescriptionForm />;
      case ProjectCreationStep.PHOTOVOLTAIC_KEY_PARAMETER:
        return <PhotovoltaicKeyParameter />;
      case ProjectCreationStep.PHOTOVOLTAIC_POWER:
        return <PhotovoltaicPower />;
      case ProjectCreationStep.PHOTOVOLTAIC_SURFACE:
        return <PhotovoltaicSurface />;
      case ProjectCreationStep.PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION:
        return <PhotovoltaicExpectedAnnualProductionContainer />;
      case ProjectCreationStep.PHOTOVOLTAIC_CONTRACT_DURATION:
        return <PhotovoltaicContractDurationContainer />;
      case ProjectCreationStep.SOILS_SURFACE_AREAS:
        return <ProjectSoilsSurfaceAreasContainer />;
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
